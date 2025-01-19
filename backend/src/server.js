const express = require('express');
require('dotenv').config();

const path = require('path');
const bodyParser = require('body-parser');
const setupSwagger = require('./swagger');

const cors = require('cors');

const AuthRoutes    = require('./routes/AuthRoutes');
const CommentRoutes = require('./routes/CommentRoutes');
const LikeRoutes    = require('./routes/LikeRoutes');
const ReviewRoutes  = require('./routes/ReviewRoutes');
const SongRoutes    = require('./routes/SongRoutes');
const UserRoutes    = require('./routes/UserRoutes');

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/auth', AuthRoutes);
app.use('/comments', CommentRoutes);
app.use('/likes', LikeRoutes);
app.use('/reviews', ReviewRoutes);
app.use('/songs', SongRoutes);
app.use('/users', UserRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

setupSwagger(app);

module.exports = app; 