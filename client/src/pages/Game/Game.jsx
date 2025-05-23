import React, { useEffect, useRef, useState } from "react";

import playerImage from '../../../public/images/player.jfif';
import blueBlockImage from '../../../public/images/blue_block.webp';
import redBlockImage from '../../../public/images/red_block.png';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";


export default function Game() {
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
    // Nový stav pro sledování stisknutých tlačítek pro vizuální zvýraznění
    const [leftArrowActive, setLeftArrowActive] = useState(false);
    const [rightArrowActive, setRightArrowActive] = useState(false);

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
        // Resetujeme stav tlačítek
        setLeftArrowActive(false);
        setRightArrowActive(false);
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

    // Ošetření pohybu hráče pomocí šipek a aktualizace stavu tlačítek
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameStarted || gameOver) return;
            if (e.key === "ArrowLeft") {
                keysPressedRef.current.add(e.key);
                setLeftArrowActive(true); // Aktivujeme levé tlačítko
            } else if (e.key === "ArrowRight") {
                keysPressedRef.current.add(e.key);
                setRightArrowActive(true); // Aktivujeme pravé tlačítko
            }
        };

        const handleKeyUp = (e) => {
            if (!gameStarted || gameOver) return;
            if (e.key === "ArrowLeft") {
                keysPressedRef.current.delete(e.key);
                setLeftArrowActive(false); // Deaktivujeme levé tlačítko
            } else if (e.key === "ArrowRight") {
                keysPressedRef.current.delete(e.key);
                setRightArrowActive(false); // Deaktivujeme pravé tlačítko
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
        <div className="flex justify-center  items-center pt-10 min-h-screen bg-base-300">
            {/* Vnitřní kontejner pro uspořádání herní plochy a instrukcí vedle sebe */}
            {/* Změna z flex-col na flex space-x-8 pro opětovné uspořádání vedle sebe */}
            <div className="flex space-x-8 flex-col sm:flex-row items-center gap-10 sm:gap-0">
                {/* Kontejner pro herní plochu a ovládací tlačítka pod ní */}
                <div className="flex flex-col items-center"> {/* Tento div je novinka pro seskupení */}
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

                    {/* Kontejner pro ovládací tlačítka pod hrou */}
                    {gameStarted && !gameOver && (
                        <div className="flex justify-center mt-4 space-x-4">
                            <button
                                // Zvětšení šipky a přidání min-width/min-height pro lepší vzhled
                                className={`px-6 py-3 rounded-2xl font-bold transition-colors duration-100 flex items-center justify-center min-w-[60px] min-h-[50px] text-2xl ${leftArrowActive ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                                onClick={() => {
                                    keysPressedRef.current.add('ArrowLeft');
                                    setLeftArrowActive(true);
                                    setTimeout(() => {
                                        keysPressedRef.current.delete('ArrowLeft');
                                        setLeftArrowActive(false);
                                    }, 100);
                                }}
                                onMouseDown={() => {
                                    keysPressedRef.current.add('ArrowLeft');
                                    setLeftArrowActive(true);
                                }}
                                onMouseUp={() => {
                                    keysPressedRef.current.delete('ArrowLeft');
                                    setLeftArrowActive(false);
                                }}
                                onMouseLeave={() => {
                                    keysPressedRef.current.delete('ArrowLeft');
                                    setLeftArrowActive(false);
                                }}
                            >
                                <FaArrowLeft />
                            </button>
                            <button
                                // Zvětšení šipky a přidání min-width/min-height pro lepší vzhled
                                className={`px-6 py-3 rounded-2xl font-bold transition-colors duration-100 flex items-center justify-center min-w-[60px] min-h-[50px] text-2xl ${rightArrowActive ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                                onClick={() => {
                                    keysPressedRef.current.add('ArrowRight');
                                    setRightArrowActive(true);
                                    setTimeout(() => {
                                        keysPressedRef.current.delete('ArrowRight');
                                        setRightArrowActive(false);
                                    }, 100);
                                }}
                                onMouseDown={() => {
                                    keysPressedRef.current.add('ArrowRight');
                                    setRightArrowActive(true);
                                }}
                                onMouseUp={() => {
                                    keysPressedRef.current.delete('ArrowRight');
                                    setRightArrowActive(false);
                                }}
                                onMouseLeave={() => {
                                    keysPressedRef.current.delete('ArrowRight');
                                    setRightArrowActive(false);
                                }}
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    )}
                </div>

                {/* Postranní panel s instrukcemi */}
                <div
                    className="bg-base-100 text-white p-6 rounded-3xl border-2 border-white" /* Odebrán mt-8, protože už není potřeba */
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
                            <li>Use your arrow keys or the buttons below to move</li>
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