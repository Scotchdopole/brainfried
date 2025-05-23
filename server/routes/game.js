// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Zkontroluj správnou cestu k modelu User
const jwt = require('jsonwebtoken'); // Pro ověření tokenu

// Middleware pro ověření JWT tokenu
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => { // Použij stejný secret jako při generování tokenu
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Uložíme uživatelské informace do requestu
        next();
    });
};

// POST endpoint pro uložení highscore
router.post('/save-highscore', authenticateToken, async (req, res) => {
    const { score } = req.body;
    const userId = req.user.id; // Získáme userId z ověřeného tokenu

    if (typeof score !== 'number') {
        return res.status(400).json({ message: 'Score must be a number.' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Zkontrolujeme, zda je nové skóre vyšší než stávající highscore
        if (!user.userGameHighScore || score > user.userGameHighScore) {
            user.userGameHighScore = score;
            user.userGameHighScoreTime = new Date(); // Uložíme aktuální datum a čas
            await user.save();
            return res.status(200).json({ message: 'Highscore updated successfully!', newHighScore: score });
        } else {
            return res.status(200).json({ message: 'Current score is not higher than existing highscore.', currentHighScore: user.userGameHighScore });
        }
    } catch (error) {
        console.error('Error saving highscore:', error);
        res.status(500).json({ message: 'Server error while saving highscore.' });
    }
});

// GET endpoint pro získání highscore (pro scoreboard)
router.get('/scoreboard', async (req, res) => {
    try {
        const users = await User.find({})
            .select('username userGameHighScore userGameHighScoreTime') // Vybereme jen potřebná pole
            .sort({ userGameHighScore: -1 }) // Seřadíme podle highscore sestupně
            .limit(10); // Omezíme na Top 10, můžeš změnit

        const scoreboardData = users.map(user => ({
            username: user.username,
            score: user.userGameHighScore || 0, // Pokud nemá skóre, zobrazíme 0
            time: user.userGameHighScoreTime ? user.userGameHighScoreTime.toLocaleString() : 'N/A' // Formátujeme datum a čas
        }));

        res.status(200).json(scoreboardData);
    } catch (error) {
        console.error('Error fetching scoreboard:', error);
        res.status(500).json({ message: 'Server error while fetching scoreboard.' });
    }
});

module.exports = router;