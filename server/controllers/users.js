const User = require('../models/users'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Predpokladá sa, že Mongoose model User
// je importovaný alebo dostupný v tomto scope,
// napr.:
// const User = require('../models/User');

require('dotenv').config();

// Ak je User model definovaný externe, nemusíte ho tu definovať
// const User = mongoose.model('User', userSchema);


exports.registerUser = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username is already taken' });
        }

        // Predpokladá, že User model má pre-save hook na hashovanie hesla
        const user = await User.create({ username, password });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).send({ message: 'User registered successfully', payload: userResponse });

    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.loginUser = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.status(200).send({ message: 'Login successful', payload: { token } }); // Vkladá token do payload objektu

    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).send({ message: 'No token provided' });

    const parts = token.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).send({ message: 'Token format is "Bearer TOKEN"' });
    }
    const tokenWithoutBearer = parts[1];

    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Invalid or expired token' });

        req.userId = decoded.id;
        req.user = { id: decoded.id, username: decoded.username };
        next();
    });
};


exports.updateUser = async (req, res, next) => {
    const userId = req.user.id;
    const { username, password } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).send({ message: 'User not found' });

        if (username) {
            if (username !== user.username) {
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    return res.status(400).send({ message: 'Username is already taken' });
                }
            }
            user.username = username;
        }

        if (password) {
            user.password = password; // Hashovanie sa očakáva v pre-save hooku modelu User
        }

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).send({ message: 'User updated successfully', payload: userResponse });
    } catch (err) {
        console.log(err);
        if (err.kind === 'ObjectId') {
            return res.status(400).send({ message: 'Invalid User ID format' });
        }
        res.status(500).send(err);
    }
}

exports.getUserById = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).send({ message: 'User found', payload: userResponse }); // Pridaný message pre konzistenciu

    } catch (err) {
        console.log(err);
        if (err.kind === 'ObjectId') {
            return res.status(400).send({ message: 'Invalid User ID format' });
        }
        res.status(500).send(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});

        if (!users || users.length === 0) {
            // Vracanie prázdneho poľa s 200 statusom je bežnejšie
            return res.status(200).send({ message: 'No users found', payload: [] });
        }

        const usersResponse = users.map(user => {
            const userObj = user.toObject();
            delete userObj.password;
            return userObj;
        });

        res.status(200).send({ message: 'Users found', payload: usersResponse }); // Pridaný message pre konzistenciu

    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    const { password: enteredPassword } = req.body;

    if (!enteredPassword) {
        return res.status(400).send({ message: 'Password is required in the request body to delete the account.' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(enteredPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).send({ message: 'Incorrect password. Account deletion denied.' });
        }

        await user.deleteOne();

        // Pri delete stačí message, payload zvyčajne nie je potrebný
        res.status(200).send({ message: 'User deleted successfully after password verification.' });

    } catch (err) {
        console.log('Error during user deletion process:', err); // Ponechané špecifickejší log
        if (err.kind === 'ObjectId') {
            return res.status(400).send({ message: 'Invalid User ID format' });
        }
        res.status(500).send(err);
    }
};