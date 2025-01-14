import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const GameCanvas = styled.canvas`
  border: 2px solid #fff;
  background-color: #f7f7f7;
  width: 800px;
  height: 400px;
`;

const GameContainer = styled.div`
  text-align: center;
  margin: 20px;
`;

const Game = () => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const dino = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    jumping: false,
    ducking: false,
    velocity: 0
  };

  const obstacles = [];
  let animationFrameId;
  const gravity = 0.6;
  const jumpForce = -12;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lastTime = 0;

    const gameLoop = (timestamp) => {
      if (isPaused) return;

      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update dino position
      if (dino.jumping) {
        dino.velocity += gravity;
        dino.y += dino.velocity;

        if (dino.y > 150) {
          dino.y = 150;
          dino.jumping = false;
          dino.velocity = 0;
        }
      }

      // Update obstacles
      obstacles.forEach((obstacle, index) => {
        obstacle.x -= 5;
        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(index, 1);
        }

        // Collision detection
        if (
          dino.x < obstacle.x + obstacle.width &&
          dino.x + dino.width > obstacle.x &&
          dino.y < obstacle.y + obstacle.height &&
          dino.y + dino.height > obstacle.y
        ) {
          setGameOver(true);
        }
      });

      // Draw dino
      ctx.fillStyle = '#228B22';
      // Draw dino body
      ctx.beginPath();
      const bodyHeight = dino.ducking ? dino.height / 2 : dino.height;
      ctx.ellipse(dino.x + dino.width/2, dino.y + bodyHeight/2, dino.width/2, bodyHeight/2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Draw dino head
      ctx.beginPath();
      ctx.ellipse(dino.x + dino.width*0.7, dino.y, dino.width*0.3, dino.height*0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw obstacles
      obstacles.forEach(obstacle => {
        const isFlying = obstacle.y === 100;
        ctx.fillStyle = isFlying ? '#4169E1' : '#654321';
        if (isFlying) {
          // Draw bird
          ctx.beginPath();
          ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, obstacle.height/4, 0, 0, Math.PI * 2);
          ctx.fill();
          // Draw wings
          ctx.beginPath();
          ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width, obstacle.height/6, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw bush
          ctx.beginPath();
          ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(obstacle.x + obstacle.width*0.7, obstacle.y + obstacle.height*0.3, obstacle.width/3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Update score
      if (!gameOver) {
        setScore(prev => prev + 1);
      }

      // Spawn obstacles
      if (Math.random() < 0.02) {
        const isFlying = Math.random() < 0.3;
        obstacles.push({
          x: canvas.width,
          y: isFlying ? 100 : 150,
          width: 20,
          height: 20
        });
      }

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    // Handle keyboard events
    const handleKeyDown = (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !dino.jumping) {
        dino.jumping = true;
        dino.velocity = jumpForce;
      }
      if (e.code === 'ArrowDown') {
        dino.ducking = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowDown') {
        dino.ducking = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    if (!gameOver && !isPaused) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, isPaused]);

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    obstacles.length = 0;
    dino.y = 150;
    dino.jumping = false;
    dino.ducking = false;
    dino.velocity = 0;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <GameContainer>
      <div>Score: {score}</div>
      <GameCanvas ref={canvasRef} width={800} height={400} />
      <div>
        <button className="retro-button" onClick={togglePause}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        {gameOver && (
          <button className="retro-button" onClick={restartGame}>
            Restart
          </button>
        )}
      </div>
      {gameOver && <div>Game Over!</div>}
    </GameContainer>
  );
};

export default Game;