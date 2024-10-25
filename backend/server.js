const Account = require("./models/accountdb");
const SavedQuery = require("./models/savedquerydb");
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const saltRounds = 10;
const app = express();
const port = process.env.PORT || 5001;
require('dotenv').config();
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const secretKey = process.env.JWT_SECRET_KEY;
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.use(express.static(path.join(__dirname, '..', 'frontend/build')));


// GET ROUTES
app.get("/test", (req, res) => {
    res.send({
        test: "works"
    });
});

// popular queries
app.get('/popularqueries', async (req, res) => {
    try {
        await mongoose.connect(uri);

        const popularQueries = await SavedQuery.aggregate([
            {
                $group: {
                    _id: { $toLower: "$searchQuery" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 4 // can change limit
            }
        ]);

        res.status(200).json(popularQueries);
    } catch (err) {
        console.error('Error fetching popular queries:', err);
        res.status(500).json({ error: 'Error fetching popular queries' });
    } finally {
        mongoose.connection.close();
    }
});

// get search history using user id
app.get('/searchhistory/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        await mongoose.connect(uri);

        const searchHistory = await SavedQuery.find({ userId: userId }).sort({ startDate: -1 });

        if (searchHistory.length === 0) {
            return res.status(404).json({ message: 'No search history found' });
        }

        res.status(200).json(searchHistory);
    } catch (err) {
        console.error('Error fetching search history:', err);
        res.status(500).json({ error: 'Error fetching search history' });
    } finally {
        mongoose.connection.close();
    }
});

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend/build', 'index.html'), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});


// POST ROUTES
// signup route
app.post("/signup", async (req, res) => {
    const fields = req.body;

    try {
        await mongoose.connect(uri, { useNewUrlParser: true });

        const existingUser = await Account.findOne({ email: fields.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(fields.password, saltRounds);
        const newUser = new Account({ email: fields.email, username: fields.username, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email, username: newUser.username }, secretKey, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
            .status(200).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Error registering user: ', err);
        res.status(500).json({ error: 'Error registering user' });
    } finally {
        mongoose.connection.close();
    }
});

// signin route
app.post('/signin', async (req, res) => {
    const fields = req.body;

    try {
        await mongoose.connect(uri);
        const user = await Account.findOne({ email: fields.email });

        if (user) {
            const isMatch = await bcrypt.compare(fields.password, user.password);

            if (isMatch) {
                const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, secretKey, { expiresIn: '1h' });

                res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
                    .status(200).json({ message: 'Sign in successful', user });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Sign in error' });
    } finally {
        mongoose.connection.close();
    }
});

// check if user is auth route
app.post('/isauth', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ authenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send({ authenticated: false });
        }

        res.send({ authenticated: true, user });
    });
});

// signout route
app.post('/signout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
});


//save query
app.post('/savequery', async (req, res) => {
    const fields = req.body;

    try {
        await mongoose.connect(uri);
        const newSavedQuery = new SavedQuery({ 
            userId: fields.userId, 
            searchQuery: fields.searchQuery, 
            startDate: fields.startDate, 
            endDate: fields.endDate 
        });
        await newSavedQuery.save();
        res.status(200).json({ message: 'Query Saved!' });
    } catch (err) {
        console.error('Error during saving: ', err);
        res.status(500).json({ error: 'Error during saving' })
    } finally {
        mongoose.connection.close()
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(`Click here to open: http://localhost:${port}`)
});


// PUT ROUTES
// update username
app.put('/updateusername', async (req, res) => {
    const { userId, newUsername } = req.body;

    try {
        await mongoose.connect(uri);
        const updatedUser = await Account.findByIdAndUpdate(
            userId,
            { username: newUsername },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Username updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Error updating username:', err);
        res.status(500).json({ error: 'Error updating username' });
    } finally {
        mongoose.connection.close();
    }
});

// update password
app.put('/updatepassword', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        await mongoose.connect(uri);
        const user = await Account.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // check to see if passwords match 
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Old password is incorrect' });
        }

        // hash new password 
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ error: 'Error updating password' });
    } finally {
        mongoose.connection.close();
    }
});
