// components/Scoreboard.jsx
import React, { useEffect, useState } from 'react';

export default function Scoreboard() {
    const [scoreboardData, setScoreboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScoreboard = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/game/scoreboard`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // VYLEPŠENÁ FILTRACE
                const filteredData = data.filter(entry => {
                    // 1. Zkontroluj, zda 'score' vůbec existuje v objektu
                    if (entry.score === undefined || entry.score === null) {
                        return false; // Vyluč, pokud skóre chybí nebo je null
                    }
                    // 2. Pokus se skóre převést na číslo
                    const scoreAsNumber = Number(entry.score);
                    // 3. Zkontroluj, zda je to platné číslo A je větší než 0
                    return !isNaN(scoreAsNumber) && scoreAsNumber > 0;
                });

                console.log("Raw data from API:", data); // Zkontroluj v konzoli, co přijde
                console.log("Filtered data (should not contain 0 scores):", filteredData); // Zkontroluj, co zbylo po filtru

                setScoreboardData(filteredData);
            } catch (err) {
                console.error("Failed to fetch scoreboard:", err);
                setError("Failed to load scoreboard. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchScoreboard();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-base-300 text-white">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-base-300 text-red-500 text-xl">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center py-10 bg-base-300 min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-8 text-primary">High Scores</h1>
            <div className="w-full max-w-md bg-base-100 p-6 rounded-lg shadow-xl border-2 border-white">
                {scoreboardData.length === 0 ? (
                    <p className="text-center text-lg text-gray-400">No high scores yet. Play a game to set one!</p>
                ) : (
                    <table className="table w-full text-lg">
                        <thead>
                            <tr className="text-white text-xl">
                                <th className="py-2">Rank</th>
                                <th className="py-2">Player</th>
                                <th className="py-2 text-right">Score</th>
                                <th className="py-2 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scoreboardData.map((entry, index) => (
                                // Použij nějaký unikátní klíč, username je OK, pokud je unikátní
                                <tr key={entry.username || index} className={`${index % 2 === 0 ? 'bg-base-200' : 'bg-base-100'} hover:bg-base-content hover:text-base-100`}>
                                    <td className="py-3">{index + 1}.</td>
                                    <td className="py-3 font-semibold">{entry.username}</td>
                                    <td className="py-3 text-right">{entry.score}</td>
                                    <td className="py-3 text-right text-sm text-gray-400">
                                        {/* Zde je vhodné formátovat datum */}
                                        {entry.time && !isNaN(new Date(entry.time)) ? new Date(entry.time).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}