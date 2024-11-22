import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;
const weatherApiKey = process.env.WEATHER_API_KEY;
const bot = new TelegramBot(token, { polling: true });

let users = {}; // Store user subscriptions and cities

bot.on('message', (msg) => {
    const chatId = msg.chat.id; // Extract chatId from the coonsolelog
    console.log(`Chat ID: ${chatId}`);
});

// Function to fetch weather data
const getWeather = async (city) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);
        return `Weather in ${data.name}:\nTemperature: ${data.main.temp}°C\nWeather: ${data.weather[0].description}\nHumidity: ${data.main.humidity}%`;
    } catch (error) {
        return `Error: ${error.message}`;
    }
};

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    if (!users[chatId]) {
        users[chatId] = { blocked: false }; // Initialize user data if not present
    }

    if (users[chatId].blocked) {
        bot.sendMessage(chatId, 'You are blocked from using this bot.');
        return;
    }
    
    bot.sendMessage(msg.chat.id, 'Welcome to WeatherBot! Use /subscribe to get weather updates.');
});

// Subscribe command
bot.onText(/\/subscribe/, (msg) => {
    const chatId = msg.chat.id;

    if (!users[chatId]) users[chatId] = { blocked: false };

    if (users[chatId]?.city) {
        bot.sendMessage(chatId, 'You are already subscribed. Use /unsubscribe to stop updates.');
        return;
    }
    bot.sendMessage(chatId, 'Please send the name of your city.');
    users[chatId] = {}; // Initialize user data
});

// Handle city input
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // Check if the user is in the process of subscribing
    if (users[chatId] && !users[chatId].city && msg.text[0] !== '/') {
        const city = msg.text;
        users[chatId].city = city;
        bot.sendMessage(chatId, `Subscribed to weather updates for ${city}.`);
        getWeather(city).then((update) => bot.sendMessage(chatId, update));
    }
});

// Unsubscribe command
bot.onText(/\/unsubscribe/, (msg) => {
    const chatId = msg.chat.id;
    if (users[chatId]) {
        delete users[chatId];
        bot.sendMessage(chatId, 'Unsubscribed from weather updates.');
    } else {
        bot.sendMessage(chatId, 'You are not subscribed.');
    }
});

// Periodic updates
setInterval(async () => {
    for (const chatId in users) {
        const city = users[chatId]?.city;
        if (city) {
            const weather = await getWeather(city);
            bot.sendMessage(chatId, weather);
        }
    }
}, 600000); // 10 minutes
