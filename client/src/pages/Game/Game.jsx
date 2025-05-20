import React, { useEffect, useRef, useState } from "react";

export default function CatchBlocksGame() {
    const width = 400;
    const height = 300;
    const blockSize = 20;
    const playerSize = 20;
    const playerY = height - playerSize - 10;
    const playerSpeed = 8; // Rychlost pohybu hráče

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [playerX, setPlayerX] = useState(width / 2 - playerSize / 2);
    const [obstacles, setObstacles] = useState([]);

    const intervalRef = useRef(); // Ref pro ID intervalu
    const gameLoopRef = useRef(); // Ref pro držení aktuální verze funkce herní logiky
    // Ref pro sledování, které klávesy jsou aktuálně drženy
    const keysPressedRef = useRef(new Set());

    // Effekt 1: Definuje a aktualizuje funkci herní logiky (moveGame).
    // Tento effekt se spustí, když se změní stav nebo konstanty, které funkce moveGame používá,
    // a zajistí, že gameLoopRef.current vždy odkazuje na funkci s nejnovějšími hodnotami.
    useEffect(() => {
        // Pomocná funkce pro vytvoření nové překážky
        const spawnObstacle = (currentPlayerX) => {
            let x;
            // Zajišťujeme, že se nová překážka neobjeví blízko hráče
            do {
                x = Math.floor(Math.random() * (width - blockSize));
            } while (Math.abs(x - currentPlayerX) < blockSize * 1.5); // Kontrola vzdálenosti

            const isBlue = Math.random() < 0.6; // Mírně zvýšená šance na modrou
            const newObstacle = {
                id: Date.now() + Math.random(), // Unikátní ID pro klíče
                x,
                y: 0,
                color: isBlue ? "blue" : "red"
            };
            return newObstacle;
        };

        // Hlavní funkce herní logiky, která bude volána intervalem.
        // Tato funkce zachytí (closure) aktuální stavové proměnné a konstanty
        // z renderu, ve kterém se tento effekt spustil.
        const moveGame = () => {
            // --- Pohyb hráče ---
            // Získej směr pohybu z refu držených kláves
            let playerVX = 0;
            if (keysPressedRef.current.has('ArrowLeft') && !keysPressedRef.current.has('ArrowRight')) {
                playerVX = -1;
            } else if (keysPressedRef.current.has('ArrowRight') && !keysPressedRef.current.has('ArrowLeft')) {
                playerVX = 1;
            }

            // Vypočítej novou pozici hráče
            const newPlayerX = playerX + playerVX * playerSpeed;

            // Omezení pohybu hráče v rámci hrací plochy a aktualizace stavu
            const clampedPlayerX = Math.max(0, Math.min(width - playerSize, newPlayerX));

            // Aktualizuj stav playerX - to spustí re-render a tento useEffect se znovu spustí,
            // čímž se gameLoopRef.current aktualizuje s novou pozicí hráče v closure.
            setPlayerX(clampedPlayerX);

            // --- Pohyb a logika překážek ---
            // 1. Posuň stávající překážky a filtruj ty mimo obrazovku
            let nextObstacles = obstacles
                .map(obs => ({ ...obs, y: obs.y + 5 }))
                .filter(obs => obs.y < height);

            let currentScore = score;
            let isGameOver = false;

            // 2. Zpracuj kolize s přeživšími překážkami
            const remainingObstaclesAfterCollision = [];
            for (let obs of nextObstacles) {
                // Přesnější AABB (Axis-Aligned Bounding Box) kolize check
                const pLeft = clampedPlayerX; // Použij novou (již aktualizovanou) pozici hráče pro kolizi
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
                        break; // Při kolizi s červenou hned konec kontroly kolizí
                    } else if (obs.color === "blue") {
                        currentScore += 1; // Zvyš skóre
                        continue; // Přeskoč přidání této překážky do remaining
                    }
                }
                // Překážka, která nekolidovala nebo byla červená (a ještě neskončila hra), se přidává
                remainingObstaclesAfterCollision.push(obs);
            }

            // 3. Aktualizuj stav skóre a konce hry
            setScore(currentScore);
            setGameOver(isGameOver);

            // 4. Aktualizuj překážky a potenciálně spawni novou, pokud hra neskončila
            if (!isGameOver) {
                setObstacles(remainingObstaclesAfterCollision);
                // Spawni novou překážku s menší šancí
                if (Math.random() < 0.1) {
                    // Použij funkční aktualizaci pro obstacles při přidávání
                    setObstacles(prevObs => [...prevObs, spawnObstacle(clampedPlayerX)]); // Použij novou pozici hráče
                }
            } else {
                // Pokud nastal konec hry, vymaž překážky
                setObstacles([]);
            }
        }; // Konec definice funkce moveGame

        // Ulož aktuální verzi funkce moveGame do refu.
        gameLoopRef.current = moveGame;

        // Závislosti: Všechny stavové proměnné a relevantní konstanty, které funkce moveGame přímo používá
        // (kromě keysPressedRef, který se čte přímo z refu).
    }, [gameOver, score, playerX, obstacles, width, playerSize, playerSpeed, blockSize, playerY]);

    // Effekt 2: Spravuje nastavení/čištění intervalu na základě stavu gameOver.
    // Tento effekt se spustí pouze při mountu/unmountu nebo když se změní gameOver.
    useEffect(() => {
        if (gameOver) {
            clearInterval(intervalRef.current);
            return;
        }

        // Nastav interval pro spouštění herní logiky z refu.
        intervalRef.current = setInterval(() => {
            if (gameLoopRef.current) {
                gameLoopRef.current();
            }
        }, 50); // Rychlost snímkování hry (rychlejší = plynulejší, ale náročnější)

        // Cleanup
        return () => clearInterval(intervalRef.current);

    }, [gameOver]); // Závislost: Pouze gameOver řídí start/stop intervalu.

    // Effekt 3: Zpracovává vstup z klávesnice pro sledování držených kláves.
    // Tento effekt se stará o přidávání/odebírání kláves do/z keysPressedRef.
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver) return;
            // Přidáme klávesu do setu, pokud je to šipka
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                keysPressedRef.current.add(e.key);
                // Volitelně můžete zabránit defaultnímu chování (např. scrollování stránky)
                // e.preventDefault();
            }
        };

        const handleKeyUp = (e) => {
            if (gameOver) return;
            // Odebereme klávesu ze setu, pokud je to šipka
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                keysPressedRef.current.delete(e.key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        // Cleanup
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [gameOver]); // Závislost: Potřebuje stav gameOver pro aktivaci/deaktivaci vstupů

    // Renderování zůstává stejné
    return (
        <div className="w-[400px] h-[300px] bg-black text-white relative overflow-hidden border-2 border-white rounded">
            {/* Hráč */}
            <div
                className="absolute bg-green-400"
                style={{
                    left: `${playerX}px`, // playerX je nyní aktualizováno plynule v intervalu
                    top: `${playerY}px`,
                    width: `${playerSize}px`,
                    height: `${playerSize}px`
                }}
            />

            {/* Kostky */}
            {obstacles.map((obs) => (
                <div
                    key={obs.id}
                    className={`absolute ${obs.color === "red" ? "bg-red-500" : "bg-blue-500"
                        }`}
                    style={{
                        left: `${obs.x}px`,
                        top: `${obs.y}px`,
                        width: `${blockSize}px`,
                        height: `${blockSize}px`
                    }}
                />
            ))}

            {/* Skóre */}
            <div className="absolute top-1 left-1 text-xs">Score: {score}</div>

            {/* Game Over */}
            {gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-xl">
                    Game Over
                </div>
            )}
        </div>
    );
}