import React, { useEffect, useRef, useState } from "react";

import playerImage from '../../assets/Images/player.jfif';
import blueBlockImage from '../../assets/Images/blue_block.webp';
import redBlockImage from '../../assets/Images/red_block.png';

export default function CatchBlocksGame() {
    const width = 600;
    const height = 450;
    const blockSize = 50;
    const playerSize = 40;
    const playerY = height - playerSize - 15;
    const playerSpeed = 10;

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerX, setPlayerX] = useState(width / 2 - playerSize / 2);
    const [obstacles, setObstacles] = useState([]);

    const intervalRef = useRef();
    const gameLoopRef = useRef();
    const keysPressedRef = useRef(new Set());

    const startGame = () => {
        setGameStarted(true);
        resetGame();
    };

    const resetGame = () => {
        setScore(0);
        setGameOver(false);
        setPlayerX(width / 2 - playerSize / 2);
        setObstacles([]);
        keysPressedRef.current.clear();
    };

    useEffect(() => {
        const spawnObstacle = (currentPlayerX) => {
            let x;
            do {
                x = Math.floor(Math.random() * (width - blockSize));
            } while (Math.abs(x - currentPlayerX) < blockSize * 1.5);

            const isBlue = Math.random() < 0.5;
            const newObstacle = {
                id: Date.now() + Math.random(),
                x,
                y: 0,
                color: isBlue ? "blue" : "red"
            };
            return newObstacle;
        };

        const moveGame = () => {
            let playerVX = 0;
            if (keysPressedRef.current.has('ArrowLeft') && !keysPressedRef.current.has('ArrowRight')) {
                playerVX = -1;
            } else if (keysPressedRef.current.has('ArrowRight') && !keysPressedRef.current.has('ArrowLeft')) {
                playerVX = 1;
            }

            const newPlayerX = playerX + playerVX * playerSpeed;
            const clampedPlayerX = Math.max(0, Math.min(width - playerSize, newPlayerX));
            setPlayerX(clampedPlayerX);

            let nextObstacles = obstacles
                .map(obs => ({ ...obs, y: obs.y + 9 }))
                .filter(obs => obs.y < height);

            let currentScore = score;
            let isGameOver = false;

            const remainingObstaclesAfterCollision = [];
            for (let obs of nextObstacles) {
                const pLeft = clampedPlayerX;
                const pRight = clampedPlayerX + playerSize;
                const pTop = playerY;
                const pBottom = playerY + playerSize;

                const obsLeft = obs.x;
                const obsRight = obs.x + blockSize;
                const obsTop = obs.y;
                const obsBottom = obs.y + blockSize;

                const collided = !(
                    pRight < obsLeft ||
                    pLeft > obsRight ||
                    pBottom < obsTop ||
                    pTop > obsBottom
                );

                if (collided) {
                    if (obs.color === "red") {
                        isGameOver = true;
                        break;
                    } else if (obs.color === "blue") {
                        currentScore += 1;
                        continue;
                    }
                }
                remainingObstaclesAfterCollision.push(obs);
            }

            setScore(currentScore);
            setGameOver(isGameOver);

            if (!isGameOver) {
                setObstacles(remainingObstaclesAfterCollision);
                if (Math.random() < 0.15) {
                    setObstacles(prevObs => [...prevObs, spawnObstacle(clampedPlayerX)]);
                }
            } else {
                setObstacles([]);
            }
        };

        if (gameStarted && !gameOver) {
            gameLoopRef.current = moveGame;
        }

    }, [gameStarted, gameOver, score, playerX, obstacles, width, playerSize, playerSpeed, blockSize, playerY]);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            intervalRef.current = setInterval(() => {
                if (gameLoopRef.current) {
                    gameLoopRef.current();
                }
            }, 35);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);

    }, [gameStarted, gameOver]);

    // Ošetření pohybu hráče pomocí šipek
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameStarted || gameOver) return;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                keysPressedRef.current.add(e.key);
            }
        };

        const handleKeyUp = (e) => {
            if (!gameStarted || gameOver) return;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                keysPressedRef.current.delete(e.key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [gameStarted, gameOver]);

    // Nový useEffect pro restart hry Enterem po Game Over
    useEffect(() => {
        const handleEnterRestart = (e) => {
            // Pokud je hra skončená a je stisknut Enter
            if (gameOver && e.key === "Enter") {
                resetGame(); // Zavoláme funkci pro restart hry
            }
        };

        window.addEventListener("keydown", handleEnterRestart);

        return () => {
            window.removeEventListener("keydown", handleEnterRestart);
        };
    }, [gameOver]); // Závislost na `gameOver` pro správné spuštění posluchače

    return (
        // Hlavní kontejner pro centrování obsahu
        <div className="flex justify-center items-start pt-10 min-h-screen bg-base-300">
            {/* Vnitřní kontejner pro uspořádání herní plochy a instrukcí vedle sebe */}
            <div className="flex space-x-8">
                {/* Herní plocha */}
                <div
                    className="bg-black text-white relative overflow-hidden border-2 border-white rounded-3xl"
                    style={{
                        width: `${width}px`,
                        height: `${height}px`
                    }}
                >
                    {!gameStarted ? (
                        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-xl">
                            <h1 className="text-4xl font-bold mb-6">Catch Brainrot</h1>
                            <button
                                onClick={startGame}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl cursor-pointer transition-colors duration-200 text-2xl"
                            >
                                Start Game
                            </button>
                        </div>
                    ) : (
                        <>
                            <img
                                src={playerImage}
                                alt="Player"
                                className="absolute"
                                style={{
                                    left: `${playerX}px`,
                                    top: `${playerY}px`,
                                    width: `${playerSize}px`,
                                    height: `${playerSize}px`,
                                    objectFit: 'contain'
                                }}
                            />

                            {obstacles.map((obs) => (
                                <img
                                    key={obs.id}
                                    src={obs.color === "red" ? redBlockImage : blueBlockImage}
                                    alt={obs.color === "red" ? "Red Block" : "Blue Block"}
                                    className={`absolute`}
                                    style={{
                                        left: `${obs.x}px`,
                                        top: `${obs.y}px`,
                                        width: `${blockSize}px`,
                                        height: `${blockSize}px`,
                                        objectFit: 'contain'
                                    }}
                                />
                            ))}

                            <div className="absolute top-2 left-2 text-base">Score: {score}</div>

                            {gameOver && (
                                <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-xl">
                                    <div className="text-4xl font-bold mb-6">Game Over</div>
                                    <button
                                        onClick={resetGame}
                                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl cursor-pointer transition-colors duration-200 text-2xl"
                                    >
                                        Restart Game
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Postranní panel s instrukcemi */}
                <div
                    className="bg-base-100 text-white p-6 rounded-3xl border-2 border-white"
                    style={{
                        width: '280px',
                        height: `${height}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    <div>
                        <h2 className="text-2xl font-bold mb-4">How to Play: Catch Brainrot</h2>
                        <ul className="list-disc list-inside text-lg space-y-2">
                            <li>Start the game</li>
                            <li>Use your arrow keys to move</li>
                            <li>Try to catch as much brainrot as you can while avoiding the grass</li>
                        </ul>
                    </div>
                    <div className="text-sm text-gray-400 mt-4">
                        <p>Have fun and try to beat your high score!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}