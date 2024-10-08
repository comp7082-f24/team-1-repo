const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5001;
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(`Click here to open: http://localhost:${port}`)
});