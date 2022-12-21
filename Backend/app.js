const path = require('path');
const express = require('express');


const app = express();

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.get('/', (req, res) => {
    res.send('PONG')
    // res.sendFile('./index.html');
});


// app.post('/detect', (req, res) => detect(req, res, sendJSON));

app.listen(8080, () => console.log('Anomaly Detection Server is up!'));