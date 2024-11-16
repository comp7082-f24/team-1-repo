const { app, mongoose } = require("./server");
const port = process.env.PORT || 5001;
mongoose.connect(uri, {
    useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Click here to open: http://localhost:${port}`);
});
