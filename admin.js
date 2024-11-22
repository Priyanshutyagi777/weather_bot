import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

// Update CORS middleware to allow both localhost and 127.0.0.1
app.use(cors({
    origin:'*',   //function(origin, callback) {
    //     if (origin === 'http://localhost:8080' || origin === 'http://127.0.0.1:8080') {
    //         callback(null, true);
    //     } else {
    //         callback(new Error('Not allowed by CORS'));
    //     }
    // },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Admin credentials
const adminPassword = 'admin123';

// Store bot settings and user data
let settings = {
    weatherApiKey: process.env.WEATHER_API_KEY,
    botToken: process.env.BOT_TOKEN,
};

let users = {};

app.get('/', (req, res) => {
    res.send('Welcome to the Weather Bot Admin Panel!');
});

// Adding route to handle GET requests to /admin
app.get('/admin', (req, res) => {
    res.send('Welcome to the Admin Panel');
});

// Admin login route
app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === adminPassword) {
        res.send('Admin login successful');
    } else {
        res.status(401).send('Unauthorized');
    }
});

// View settings
app.get('/admin/settings', (req, res) => {
    res.json(settings);
});

// Update weather API key
app.post('/admin/update-weather-api', (req, res) => {
    const { newApiKey } = req.body;
    if (newApiKey) {
        settings.weatherApiKey = newApiKey;
        res.send('Weather API key updated');
    } else {
        res.status(400).send('API Key is required');
    }
});

// Block a user
app.post('/admin/block-user', (req, res) => {
    const { chatId } = req.body;
    if (users[chatId]) {
        users[chatId].blocked = true;
        res.send(`User ${chatId} is now blocked.`);
    } else {
        res.status(400).send('User not found.');
    }
});

// Delete a user
app.post('/admin/delete-user', (req, res) => {
    const { chatId } = req.body;
    if (users[chatId]) {
        delete users[chatId];
        res.send(`User ${chatId} deleted.`);
    } else {
        res.status(400).send('User not found.');
    }
});

app.listen(port, () => {
    console.log(`Admin panel is running on http://localhost:${port}`);
});
