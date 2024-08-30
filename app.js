const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB URL based on Docker Compose service name
const mongoUrlDocker = "mongodb://admin:password@mongo:27017";

// MongoDB connection options
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// Database name
const databaseName = "my-db";

// Handle reservation
app.post('/reservation', async (req, res) => {
    const { name, email, phone, bookingDate, time, people } = req.body;
    const reservationDetails = { name, email, phone, bookingDate, time, people };

    console.log('Received Reservation Data:', reservationDetails);

    try {
        const client = await MongoClient.connect(mongoUrlDocker, mongoClientOptions);
        const db = client.db(databaseName);

        await db.collection('reservations').insertOne(reservationDetails);

        console.log('Reservation inserted successfully');
        client.close();
        res.send('Reservation successful!');
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).send('Database error');
    }
});

// Serve static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server started at http://localhost:${port}`);
});
