const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const customEnv = require('custom-env');



// Start of part 3:
const http = require("http");
const { Server } = require('socket.io');
app.use(cors());

customEnv.env(process.env.NODE_ENV, './config'); // Load environment variables from a custom file

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    }
})

io.on("connection", (socket) => {
    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data);
    });
});
server.listen(process.env.PORT_COMMUNICATION, () => {})

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(bodyParser.json({limit:'50mb'})); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing


// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, { // Connect to MongoDB using the specified URL
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

app.use(express.static('public')); // Serve static files from the 'public' directory

// Routes
// const chatRoutes = require('./routes/motion');
// app.use('/', chatRoutes); // Mount the chat routes on the root path

// Start the server
app.listen(process.env.PORT_MONGO, () => { // Start the server and listen on port process.env.PORT
    console.log('Server started on port: ' + process.env.PORT_MONGO);
});


// EXAMPLE
const {sendToMultithreadedServer} = require("./connectTCPServer"); // Import the chat routes
async function sendDataToTCP() {
    const bloomFilterFormat = ["x+y+z=3"];

    let result = await sendToMultithreadedServer(JSON.stringify(bloomFilterFormat));
}
sendDataToTCP();