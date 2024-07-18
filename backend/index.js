import express from "express";
import mongoose from "mongoose";
import createUserRouter from './routes/getin.js';
import Router2 from './routes/other.js';
import Router3 from "./routes/other2.js"
const mongourl = "mongodb+srv://connex:connex@connex.kffvapk.mongodb.net/?retryWrites=true&w=majority&appName=Connex";

async function connectAndFetch() {
    try {
        await mongoose.connect(mongourl);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

connectAndFetch();

const app = express();
const port = 5000;

app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://connex-frontend.onrender.com");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>");
});

app.use("/api/", createUserRouter);
app.use("/api/", Router2);
app.use("/api/", Router3);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
