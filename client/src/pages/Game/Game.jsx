import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from '../../authContext';
import { Link } from "react-router-dom";

import playerImage from '../../assets/Images/player.jfif';
import blueBlockImage from '../../assets/Images/blue_block.webp';
import redBlockImage from '../../assets/Images/red_block.png';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";


export default function Game() {
    const { isLoggedIn, userId } = useAuth();

    const BASE_WIDTH = 600;
    const BASE_HEIGHT = 450;
    const BASE_BLOCK_SIZE = 50;
    const BASE_PLAYER_SIZE = 40;
    const BASE_PLAYER_Y_OFFSET = 15;
    const BASE_PLAYER_SPEED = 10;

    const [gameWidth, setGameWidth] = useState(BASE_WIDTH);
    const [gameHeight, setGameHeight] = useState(BASE_HEIGHT);
    const [blockSize, setBlockSize] = useState(BASE_BLOCK_SIZE);
    const [playerSize, setPlayerSize] = useState(BASE_PLAYER_SIZE);

    const [playerY, setPlayerY] = useState(BASE_HEIGHT - BASE_PLAYER_SIZE - BASE_PLAYER_Y_OFFSET);
    const [playerSpeedScaled, setPlayerSpeedScaled] = useState(BASE_PLAYER_SPEED);

    const [playerXBase, setPlayerXBase] = useState(BASE_WIDTH / 2 - BASE_PLAYER_SIZE / 2);
    const [obstaclesBase, setObstaclesBase] = useState([]);

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [leftArrowActive, setLeftArrowActive] = useState(false);
    const [rightArrowActive, setRightArrowActive] = useState(false);

    const [scoreboardData, setScoreboardData] = useState([]);
    const [scoreboardLoading, setScoreboardLoading] = useState(true);
    const [scoreboardError, setScoreboardError] = useState(null);

    const intervalRef = useRef();
    const gameLoopRef = useRef();
    const keysPressedRef = useRef(new Set());
    const latestScoreRef = useRef(score);

    const gameParentContainerRef = useRef(null);
    const scaleRef = useRef(1);

    useEffect(() => {
        latestScoreRef.current = score;
    }, [score]);

    const updateGameDimensions = useCallback(() => {
        if (gameParentContainerRef.current) {
            const availableWidth = gameParentContainerRef.current.clientWidth;

            let newWidth = Math.min(availableWidth, BASE_WIDTH);

            const minGameWindowWidth = 320;
            if (newWidth < minGameWindowWidth) {
                newWidth = minGameWindowWidth;
            }

            const newScale = newWidth / BASE_WIDTH;
            scaleRef.current = newScale;

            const newHeight = BASE_HEIGHT * newScale;

            setGameWidth(newWidth);
            setGameHeight(newHeight);
            setBlockSize(BASE_BLOCK_SIZE * newScale);
            setPlayerSize(BASE_PLAYER_SIZE * newScale);
            setPlayerY(newHeight - (BASE_PLAYER_SIZE * newScale) - (BASE_PLAYER_Y_OFFSET * newScale));
            setPlayerSpeedScaled(BASE_PLAYER_SPEED * newScale);
        }
    }, []);

    useEffect(() => {
        updateGameDimensions();
        window.addEventListener('resize', updateGameDimensions);
        return () => window.removeEventListener('resize', updateGameDimensions);
    }, [updateGameDimensions]);

    const startGame = () => {
        setGameStarted(true);
        resetGame();
    };

    const resetGame = () => {
        setScore(0);
        setGameOver(false);

        setPlayerXBase(BASE_WIDTH / 2 - BASE_PLAYER_SIZE / 2);
        setObstaclesBase([]);
        keysPressedRef.current.clear();
        setLeftArrowActive(false);
        setRightArrowActive(false);
        fetchScoreboard(); // Fetch scoreboard on game reset
    };

    const saveHighScore = async (finalScore) => {
        console.log('Attempting to save highscore:', finalScore, 'Is logged in:', isLoggedIn);
        if (!isLoggedIn || finalScore === 0) {
            console.log('Skipping highscore save: User not logged in or score is 0.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No token found, cannot save highscore.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/game/save-highscore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ score: finalScore })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                fetchScoreboard(); // Refresh scoreboard after saving a new score
            } else {
                const errorData = await response.json();
                console.error('Failed to save highscore:', errorData.message);
            }
        } catch (error) {
            console.error('Error saving highscore:', error);
        }
    };

    const fetchScoreboard = async () => {
        setScoreboardLoading(true);
        setScoreboardError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/game/scoreboard`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Assuming the backend sends an array of objects, each with 'username', 'score', and 'userGameHighScoreTime'
            setScoreboardData(data);
        } catch (err) {
            console.error("Failed to fetch scoreboard:", err);
            setScoreboardError("Failed to load scoreboard. Please try again later.");
        } finally {
            setScoreboardLoading(false);
        }
    };

    useEffect(() => {
        fetchScoreboard();
    }, []); // Fetch scoreboard on initial component mount

    useEffect(() => {
        const spawnObstacle = (currentPlayerXBase) => {
            let x;
            do {
                x = Math.floor(Math.random() * (BASE_WIDTH - BASE_BLOCK_SIZE));
            } while (Math.abs(x - currentPlayerXBase) < BASE_BLOCK_SIZE * 1.5);

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
            const currentScale = scaleRef.current;

            let playerVX = 0;
            if (keysPressedRef.current.has('ArrowLeft') && !keysPressedRef.current.has('ArrowRight')) {
                playerVX = -1;
            } else if (keysPressedRef.current.has('ArrowRight') && !keysPressedRef.current.has('ArrowLeft')) {
                playerVX = 1;
            }

            const newPlayerXBase = playerXBase + playerVX * BASE_PLAYER_SPEED;
            const clampedPlayerXBase = Math.max(0, Math.min(BASE_WIDTH - BASE_PLAYER_SIZE, newPlayerXBase));
            setPlayerXBase(clampedPlayerXBase);

            const obstacleFallSpeedBase = 9;
            let nextObstaclesBase = obstaclesBase
                .map(obs => ({ ...obs, y: obs.y + obstacleFallSpeedBase }))
                .filter(obs => obs.y < BASE_HEIGHT);

            let currentScore = score;
            let isGameOver = false;

            const remainingObstaclesAfterCollision = [];
            for (let obs of nextObstaclesBase) {
                const pLeft = clampedPlayerXBase * currentScale;
                const pRight = (clampedPlayerXBase + BASE_PLAYER_SIZE) * currentScale;
                const pTop = playerY;
                const pBottom = playerY + playerSize;

                const obsLeft = obs.x * currentScale;
                const obsRight = (obs.x + BASE_BLOCK_SIZE) * currentScale;
                const obsTop = obs.y * currentScale;
                const obsBottom = (obs.y + BASE_BLOCK_SIZE) * currentScale;

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
                        continue; // Do not add blue obstacle back to remainingObstaclesAfterCollision
                    }
                }
                remainingObstaclesAfterCollision.push(obs); // Only add if no collision or red block collision
            }

            setScore(currentScore);
            setGameOver(isGameOver);

            if (isGameOver && gameStarted) {
                saveHighScore(latestScoreRef.current);
            }

            if (!isGameOver) {
                setObstaclesBase(remainingObstaclesAfterCollision);

                // Adjust spawn rate/logic as needed
                if (Math.random() < 0.15) { // Probability of spawning a new obstacle
                    setObstaclesBase(prevObs => [...prevObs, spawnObstacle(clampedPlayerXBase)]);
                }
            } else {
                setObstaclesBase([]); // Clear obstacles on game over
            }
        };

        if (gameStarted && !gameOver) {
            gameLoopRef.current = moveGame;
        }

    }, [gameStarted, gameOver, score, playerXBase, obstaclesBase, gameWidth, gameHeight, playerSize, playerY, latestScoreRef, isLoggedIn, blockSize, playerSpeedScaled]);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            intervalRef.current = setInterval(() => {
                if (gameLoopRef.current) {
                    gameLoopRef.current();
                }
            }, 35); // Game loop update interval (approx 28 FPS)
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);

    }, [gameStarted, gameOver]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameStarted || gameOver) return;
            if (e.key === "ArrowLeft") {
                keysPressedRef.current.add(e.key);
                setLeftArrowActive(true);
            } else if (e.key === "ArrowRight") {
                keysPressedRef.current.add(e.key);
                setRightArrowActive(true);
            }
        };

        const handleKeyUp = (e) => {
            if (!gameStarted || gameOver) return;
            if (e.key === "ArrowLeft") {
                keysPressedRef.current.delete(e.key);
                setLeftArrowActive(false);
            } else if (e.key === "ArrowRight") {
                keysPressedRef.current.delete(e.key);
                setRightArrowActive(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [gameStarted, gameOver]);

    useEffect(() => {
        const handleEnterRestart = (e) => {
            if (gameOver && e.key === "Enter") {
                resetGame();
            }
        };

        window.addEventListener("keydown", handleEnterRestart);

        return () => {
            window.removeEventListener("keydown", handleEnterRestart);
        };
    }, [gameOver]);


    return (
        <div className="min-h-screen bg-base-300 flex flex-col pb-20 md:pb-40 overflow-x-hidden">
            <Navbar></Navbar>
            <div className="flex flex-col items-center justify-start pt-10 px-4 gap-10 w-full max-w-full overflow-hidden">

                <div ref={gameParentContainerRef} className="flex flex-col items-center w-full max-w-[600px] mx-auto">
                    <div
                        className="bg-black text-white relative shadow-2xl rounded-3xl"
                        style={{
                            width: `${gameWidth}px`,
                            height: `${gameHeight}px`,
                            overflow: 'hidden'
                        }}
                    >
                        {!gameStarted ? (
                            <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-xl p-4">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center">Catch Brainrot</h1>
                                <button
                                    onClick={startGame}
                                    className="px-6 py-2 sm:px-8 sm:py-3 btn btn-primary text-white font-bold rounded-2xl cursor-pointer transition-colors duration-200 text-xl sm:text-2xl"
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
                                        left: `${playerXBase * scaleRef.current}px`,
                                        top: `${playerY}px`,
                                        width: `${playerSize}px`,
                                        height: `${playerSize}px`,
                                        objectFit: 'contain'
                                    }}
                                />

                                {obstaclesBase.map((obs) => (
                                    <img
                                        key={obs.id}
                                        src={obs.color === "red" ? redBlockImage : blueBlockImage}
                                        alt={obs.color === "red" ? "Red Block" : "Blue Block"}
                                        className={`absolute`}
                                        style={{
                                            left: `${obs.x * scaleRef.current}px`,
                                            top: `${obs.y * scaleRef.current}px`,
                                            width: `${blockSize}px`,
                                            height: `${blockSize}px`,
                                            objectFit: 'contain'
                                        }}
                                    />
                                ))}

                                <div className="absolute top-2 left-2 text-base sm:text-lg">Score: {score}</div>

                                {gameOver && (
                                    <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-xl p-4">
                                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center">Game Over</div>
                                        <button
                                            onClick={resetGame}
                                            className="px-6 py-2 sm:px-8 sm:py-3 btn btn-primary text-white font-bold rounded-2xl cursor-pointer transition-colors duration-200 text-xl sm:text-2xl"
                                        >
                                            Restart Game
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="h-20 w-full flex justify-center mt-4 px-4">
                        {gameStarted && !gameOver && (
                            <div className="flex justify-center space-x-4 max-w-full">
                                <button
                                    className={`px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-bold transition-colors duration-100 flex items-center justify-center min-w-[50px] min-h-[40px] sm:min-w-[60px] sm:min-h-[50px] text-xl sm:text-2xl ${leftArrowActive ? 'btn btn-primary' : 'btn btn-primary'} text-white`}
                                    onClick={() => {
                                        // For mobile click, simulate a brief key press
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
                                    onMouseLeave={() => { // Important for dragging mouse off button
                                        keysPressedRef.current.delete('ArrowLeft');
                                        setLeftArrowActive(false);
                                    }}
                                >
                                    <FaArrowLeft />
                                </button>
                                <button
                                    className={`px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-bold transition-colors duration-100 flex items-center justify-center min-w-[50px] min-h-[40px] sm:min-w-[60px] sm:min-h-[50px] text-xl sm:text-2xl ${rightArrowActive ? 'btn btn-primary' : 'btn btn-primary'} text-white`}
                                    onClick={() => {
                                        // For mobile click, simulate a brief key press
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
                                    onMouseLeave={() => { // Important for dragging mouse off button
                                        keysPressedRef.current.delete('ArrowRight');
                                        setRightArrowActive(false);
                                    }}
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-10 md:gap-8 w-full max-w-sm sm:max-w-md lg:max-w-xl">
                    <div
                        className="bg-base-100 text-white p-6 rounded-3xl shadow-2xl w-full"
                    >
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">How to play:</h2>
                            <ul className="list-disc list-inside text-base sm:text-lg space-y-2">
                                <li>Start the game</li>
                                <li>Use your arrow keys or the buttons below to move</li>
                                <li>Catch as much brainrot as you can while avoiding grass</li>
                                <li>To save your score in leaderboard, <Link to="/login" className="link link-primary">log in</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div
                        className="bg-base-100 text-white p-6 rounded-3xl shadow-2xl w-full"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white text-center">Leaderboard</h2>
                        {scoreboardLoading ? (
                            <div className="flex justify-center items-center h-24">
                                <span className="loading loading-dots loading-lg"></span>
                            </div>
                        ) : scoreboardError ? (
                            <p className="text-center text-red-500 text-sm">{scoreboardError}</p>
                        ) : scoreboardData.length === 0 ? (
                            <p className="text-center text-lg text-gray-400">No high scores yet. Play a game!</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table w-full text-base sm:text-lg">
                                    <thead>
                                        <tr className="text-primary">
                                            <th className="py-2 text-left">Rank</th>
                                            <th className="py-2 text-left">Player</th>
                                            <th className="py-2 text-right">Score</th>
                                            <th className="py-2 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scoreboardData.map((entry, index) => (
                                            <tr key={entry.username || index} className={`${index % 2 === 0 ? 'bg-base-200' : 'bg-base-100'} hover:bg-base-content hover:text-base-100`}>
                                                <td className="py-2 text-left">{index + 1}.</td>
                                                <td className="py-2 text-left font-semibold">{entry.username}</td>
                                                <td className="py-2 text-right">{entry.score}</td>
                                                <td className="py-2 text-right text-sm text-gray-400">
                                                    {/* Corrected: Use 'entry.userGameHighScoreTime' and robust date check */}
                                                    {entry.userGameHighScoreTime ? (
                                                        (() => {
                                                            const date = new Date(entry.userGameHighScoreTime);
                                                            return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
                                                        })()
                                                    ) : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}