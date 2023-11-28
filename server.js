// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/userRoute');
const errorHandler = require('./middleware/errorMiddleware');
const http = require('http');
const { initSocket } = require('./Socket/Socket'); // Import the initSocket function

const app = express();
const server = http.createServer(app);
initSocket(server); // Initialize Socket.IO

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://authz-app.vercel.app', 'http://192.168.18.10:3000'],
        credentials: true,
    })
);

// Routes
app.use('/api/users', userRoute);

app.get('/', (req, res) => {
    res.send('Home Page');
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
    server.listen(PORT, () => {
        console.log('Server is running on port 5000');
    });
});
