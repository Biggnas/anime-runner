'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function AnimeRunner() {
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [showGameOverOverlay, setShowGameOverOverlay] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<HTMLDivElement>(null);

  const gameStateRef = useRef({
    yVelocity: 0,
    isJumping: false,
    gameSpeed: 3.0,
    nextSpawnTime: 0,
    frameCount: 0,
    animationId: 0
  });

  const jump = () => {
    if (!gameRunning || gameStateRef.current.isJumping) return;
    gameStateRef.current.isJumping = true;
    gameStateRef.current.yVelocity = 8.9;
  };

  const spawnObstacle = () => {
    if (!obstaclesRef.current) return;
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.right = '-30px';
    obstaclesRef.current.appendChild(obstacle);
  };

  const startGame = () => {
    setGameRunning(true);
    setScore(0);
    setShowStartOverlay(false);
    setShowGameOverOverlay(false);

    gameStateRef.current = {
      yVelocity: 0,
      isJumping: false,
      gameSpeed: 3.0,
      nextSpawnTime: Date.now() + 1500,
      frameCount: 0,
      animationId: 0
    };

    if (obstaclesRef.current) {
      obstaclesRef.current.innerHTML = '';
    }
    if (runnerRef.current) {
      runnerRef.current.style.bottom = '6px';
    }
  };

  const endGame = (currentScore: number) => {
    setGameRunning(false);
    cancelAnimationFrame(gameStateRef.current.animationId);

    const finalScoreValue = Math.floor(currentScore);
    setFinalScore(finalScoreValue);

    if (finalScoreValue > highScore) {
      setHighScore(finalScoreValue);
    }

    setShowGameOverOverlay(true);
  };

  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = () => {
      const state = gameStateRef.current;
      state.frameCount++;

      // Update score
      if (state.frameCount % 5 === 0) {
        setScore(prev => {
          const newScore = prev + 0.1;
          return newScore;
        });
      }

      // Apply gravity
      state.yVelocity -= 0.37;
      let newBottom = parseFloat(runnerRef.current?.style.bottom || '6') + state.yVelocity;

      if (newBottom <= 6) {
        newBottom = 6;
        state.yVelocity = 0;
        state.isJumping = false;
      }

      if (runnerRef.current) {
        runnerRef.current.style.bottom = newBottom + 'px';
      }

      // Spawn obstacles
      const now = Date.now();
      if (now >= state.nextSpawnTime) {
        spawnObstacle();
        state.nextSpawnTime = now + 1000 + Math.random() * 1000;
      }

      // Move obstacles and check collisions
      const obstacles = obstaclesRef.current?.querySelectorAll('.obstacle');
      obstacles?.forEach(obstacle => {
        const currentRight = parseFloat((obstacle as HTMLElement).style.right || '0');
        (obstacle as HTMLElement).style.right = (currentRight + state.gameSpeed) + 'px';

        if (currentRight > (stageRef.current?.offsetWidth || 0)) {
          obstacle.remove();
          return;
        }

        // Collision detection
        const runnerRect = runnerRef.current?.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (runnerRect &&
          runnerRect.right > obstacleRect.left &&
          runnerRect.left < obstacleRect.right &&
          runnerRect.bottom > obstacleRect.top) {
          setScore(prev => {
            endGame(prev);
            return prev;
          });
        }
      });

      // Increase game speed
      if (state.frameCount % 100 === 0) {
        state.gameSpeed += 0.1;
      }

      state.animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(gameStateRef.current.animationId);
    };
  }, [gameRunning, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameRunning) {
          startGame();
        } else {
          jump();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameRunning]);

  return (
    <>
      <Head>
        <title>Anime Runner</title>
        <link rel="icon" href="/icon.png" type="image/png" />
      </Head>

      <div className="game-container">
        <header className="topbar">
          <div className="title">Anime Runner</div>
          <div className="scores">
            <div className="score">Score: <span>{Math.floor(score)}</span></div>
            <div className="hi">Hi: <span>{highScore}</span></div>
          </div>
        </header>

        <main className="stage-wrap">
          <div
            ref={stageRef}
            className="stage"
            onClick={() => gameRunning ? jump() : startGame()}
            aria-label="game stage"
          >
            <div className="ground"></div>

            <div ref={runnerRef} className="runner" aria-hidden="true">
              <svg viewBox="0 0 120 160" className="runner-sprite" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="60" cy="48" rx="20" ry="22" fill="#ffd8c4" />
                <path d="M60 18c-12 0-22 8-28 18 6-8 18-14 28-14s22 6 28 14c-6-10-16-18-28-18z" fill="#1e1e2f" />
                <ellipse cx="52" cy="48" rx="3.4" ry="4" fill="#111" />
                <ellipse cx="68" cy="48" rx="3.4" ry="4" fill="#111" />
                <path d="M54 60 q6 6 12 0" stroke="#5a2b1b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              </svg>

              <div className="body">
                <div className="torso"></div>
                <div className="arm arm-left"></div>
                <div className="arm arm-right"></div>
                <div className="leg leg-left"></div>
                <div className="leg leg-right"></div>
              </div>
            </div>

            <div ref={obstaclesRef} id="obstacles"></div>

            {showStartOverlay && (
              <div className="overlay">
                <div className="overlay-card">
                  <h1 className="big">Anime Runner</h1>
                  <p className="muted">Tap or press Space to jump. Avoid obstacles and get a high score!</p>
                  <div style={{ height: '8px' }}></div>
                  <button onClick={startGame} className="primary">Start Game</button>
                </div>
              </div>
            )}

            {showGameOverOverlay && (
              <div className="overlay">
                <div className="overlay-card">
                  <h2>Game Over</h2>
                  <p>Final Score: <span>{finalScore}</span></p>
                  <div style={{ height: '8px' }}></div>
                  <button onClick={startGame} className="primary">Play Again</button>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="hint">Tap / Click the stage (or press Space) to jump</footer>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Lexend', sans-serif;
          }

          body {
            background: #0d1117;
            color: #fff;
            min-height: 100vh;
          }

          .game-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: #111827;
            border-bottom: 1px solid #1f2937;
          }

          .title {
            font-weight: 600;
            font-size: 1.1rem;
          }

          .scores {
            display: flex;
            gap: 16px;
            font-size: 0.9rem;
            opacity: 0.9;
          }

          .stage-wrap {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
          }

          .stage {
            width: 95%;
            max-width: 600px;
            height: 260px;
            background: #151b23;
            border: 1px solid #1f2937;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
          }

          .ground {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 6px;
            background: #374151;
          }

          .runner {
            position: absolute;
            bottom: 6px;
            left: 32px;
            width: 50px;
            height: 90px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .runner-sprite {
            width: 42px;
            height: 56px;
          }

          .body {
            width: 14px;
            height: 36px;
            background: #1e3a8a;
            border-radius: 4px;
            margin-top: -4px;
            position: relative;
          }

          .arm, .leg {
            position: absolute;
            background: #1e3a8a;
            border-radius: 4px;
          }

          .arm {
            width: 6px;
            height: 20px;
            top: 4px;
          }

          .arm-left {
            left: -8px;
          }

          .arm-right {
            right: -8px;
          }

          .leg {
            width: 6px;
            height: 22px;
            bottom: -20px;
          }

          .leg-left {
            left: 2px;
          }

          .leg-right {
            right: 2px;
          }

          .obstacle {
            position: absolute;
            bottom: 6px;
            width: 26px;
            height: 30px;
            background: #9ca3af;
            border-radius: 4px;
          }

          .overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 14px;
            z-index: 10;
          }

          .overlay-card {
            background: #111827;
            padding: 24px;
            border-radius: 10px;
            width: 94%;
            max-width: 300px;
            text-align: center;
            border: 1px solid #1f2937;
          }

          .big {
            font-size: 1.4rem;
            margin-bottom: 8px;
            font-weight: 600;
          }

          .muted {
            font-size: 0.85rem;
            opacity: 0.8;
          }

          .primary {
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-size: 0.95rem;
            cursor: pointer;
            font-weight: 500;
          }

          .primary:hover {
            background: #1d4ed8;
          }

          .hint {
            padding: 10px;
            text-align: center;
            font-size: 0.8rem;
            opacity: 0.6;
          }
        `}</style>
      </div>
    </>
  );
}