const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const axios = require("axios")
const cron = require('node-cron');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
    try {
        res.send("Omnify Assignment Backend")
    }
    catch (err) {
        res.status(500).json(err);
    }
})

app.get("/fetchData/:location", async (req, res) => {
    const location = req.params.location;
    try {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.API_KEY}`).then((response) => res.status(200).json(response.data)).catch((err) => res.status(404).json(err.response.data.message))
    } catch (err) {
        res.status(500).json(err)
    }
})


app.get('/scheduled-api', (req, res) => {

    axios.get('https://omnify-assignment-joshua14.onrender.com/')
        .then(response => {
            console.log(response.data);
            res.send('API request sent successfully');
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Failed to send API request');
        });
});

cron.schedule('*/10 * * * *', () => {
    axios.get('http://localhost:5000/scheduled-api')
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
});


app.listen(5000, () => {
    console.log("Backend Server is Running")
})