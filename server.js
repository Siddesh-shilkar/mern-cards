const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const cards = require('./routes/api/cards');

const app = express();

// DB config
const db = require('./config/keys').mongoURI;

//connect to mongodb
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDb Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/cards', cards);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));