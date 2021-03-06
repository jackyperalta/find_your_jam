// THIS FILE STARTS THE WEB SERVER
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const port = process.env.PORT || 8001

app.use(express.json())

// Setting up the public directory
app.use(express.static('public'))

/* DB Config */
mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('database connected...'))
.catch(err => console.log(err))

/* GET a page */
app.get('/', (req, res) => {
    res.sendFile('./example.html', { root: __dirname })
});

/* Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))
