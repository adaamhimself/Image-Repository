const express = require('express');
const app = express();
const cors = require("cors");
const http = require("http");
const mongoose = require('mongoose');
require('dotenv').config();

const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const imgRouter = require('./routes/imageRoutes');
app.use('/img', imgRouter);
const searchRouter = require('./routes/searchRoutes');
app.use('/find', searchRouter);

// Mongo connect
mongoose.connect(process.env.MONGO_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on("open", () => {
    console.log("Database connection open.");
});
mongoose.connection.on("error", (error) => console.error(error));

// Start server
http.createServer(app).listen(HTTP_PORT, () => {
    console.log("Express https server listening on: " + HTTP_PORT);
});