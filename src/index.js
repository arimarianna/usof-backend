
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const { ClientError, ServerError } = require('./errors');
const path = require('path');

require('dotenv').config();
require('./models');
require('./controllers/mailer');

const router = require('./routes');

const port = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use('/avatars', express.static(path.join(__dirname, 'storage', 'avatars')));

app.use('/api/', router);

app.use((req, res, next) => {
  next(new ClientError('Page not found').NotFound());
});

app.use((err, req, res, next) => {
  if (!(err instanceof ClientError || err instanceof ServerError)) {
    err = new ServerError('Server error. Sorry!');          
  }

  res.status(err.code).send({ error: err.message });
});


app.listen(port, () => console.log(`Usof start at port ${port}.`));
