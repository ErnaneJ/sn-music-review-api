const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');

const setupSwagger = require('./swagger');

const AuthRoutes    = require('./routes/AuthRoutes');
const CommentRoutes = require('./routes/CommentRoutes');
const LikeRoutes    = require('./routes/LikeRoutes');
const ReviewRoutes  = require('./routes/ReviewRoutes');
const SongRoutes    = require('./routes/SongRoutes');
const UserRoutes    = require('./routes/UserRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/auth', AuthRoutes);
app.use('/comments', CommentRoutes);
app.use('/likes', LikeRoutes);
app.use('/reviews', ReviewRoutes);
app.use('/songs', SongRoutes);
app.use('/users', UserRoutes);

setupSwagger(app);

module.exports = app; 