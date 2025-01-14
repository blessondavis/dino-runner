from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    avatar: Optional[str] = None

    class Config:
        orm_mode = True

class ScoreBase(BaseModel):
    score: int
    user_id: int

class ScoreCreate(ScoreBase):
    pass

class Score(ScoreBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True