// THIS FILE STARTS THE WEB SERVER
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());

// J.P: 3/17/21 - Import routers
const userRouter = require ('./routes/UserRouter.js');
app.use('/users', userRouter);

app.use(express.static('front-end'));

// DB Config
mongoose.connect(process.env.DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('database connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.sendFile('front-end/indexk.html', { root: __dirname })
});

// Listener
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
