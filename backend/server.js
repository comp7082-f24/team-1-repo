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


app.get("/test", (req, res) => {
    res.send({
        test: "works"
    });
});

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'frontend/build', 'index.html'), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

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
        const newSavedQuery = new SavedQuery({ userId: fields.userId, searchQuery: fields.searchQuery})
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