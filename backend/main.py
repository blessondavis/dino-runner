from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import models
import schemas
from database import SessionLocal, engine
import jwt
from passlib.context import CryptContext
import shutil
import os

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup():
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin_user = db.query(models.User).filter(models.User.username == "admin").first()
        if not admin_user:
            # Create default admin user
            hashed_password = pwd_context.hash("1234")
            admin_user = models.User(
                username="admin",
                email="admin@example.com",
                hashed_password=hashed_password
            )
            db.add(admin_user)
            db.commit()
            db.commit()
    finally:
        db.close()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Game API"}

# Security
SECRET_KEY = "your-secret-key-paste"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/upload-avatar/{user_id}")
async def upload_avatar(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    upload_dir = "avatars"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    file_path = f"{upload_dir}/{user_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update user's avatar path in database
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.avatar = file_path
        db.commit()
        return {"filename": file_path}
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/scores/")
def save_score(score: schemas.ScoreCreate, db: Session = Depends(get_db)):
    db_score = models.Score(**score.dict())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

@app.get("/high-scores/{user_id}")
def get_high_scores(user_id: int, db: Session = Depends(get_db)):
    scores = db.query(models.Score).filter(models.Score.user_id == user_id)\
        .order_by(models.Score.score.desc())\
        .limit(10)\
        .all()
    return scores