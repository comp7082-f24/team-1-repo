const Account = require("./models/accountdb");
const SavedQuery = require("./models/savedquerydb");
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 5001;
require('dotenv').config();
app.use(cors());
app.use(express.json());

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
        const newUser = new Account({ username: fields.username, password: fields.password, location: fields.location});
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Error registering user: ', err);
        res.status(500).json({ error: 'Error registering user' });
    } finally {
        mongoose.connection.close();
    }
});

// login route
app.post('/login', async (req, res) => {
    const fields = req.body;

    try {
        await mongoose.connect(uri);
        const user = await Account.findOne({ username: fields.username, password: fields.password });

        if (user) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login error' });
    } finally {
        mongoose.connection.close();
    }
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