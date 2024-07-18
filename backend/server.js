import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = new Server(server);
import mongoose from "mongoose";
const mongourl = "mongodb+srv://connex:connex@connex.kffvapk.mongodb.net/?retryWrites=true&w=majority&appName=Connex";
var Id="hjhj"
async function connectAndFetch() {
    try {
        await mongoose.connect(mongourl);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}
connectAndFetch()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

io.on('connection', (socket) => {
    socket.on("Id", (msg) => {
        Id=msg.id;
        console.log(Id)
    });
    socket.on(Id, (msg) => {
        console.log('Message from client: ', msg);
        io.emit(Id, msg);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
app.get('/', (req, res) => {
    res.send('Server is running'); // Replace with your desired response
});




const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
