const express = require('express'),
  mongoose = require('mongoose'),
  uuid = require('uuidv4').default,
  SessionModel = require('../models/Session'),
  debug = require('debug')('routes:index'),
  createHttpError = require('http-errors');

const router = express.Router();
const connection = mongoose.createConnection('mongodb://localhost/battleships',
  { useNewUrlParser: true, useUnifiedTopology: true });
const sessionModel = new SessionModel(connection);

/* GET home page. */
router.get('/', function (req, res, next) {
  const url = req.query.url;

  res.render('index', { title: 'BattleShips', sessionUrl: url });
});

router.get('/session/:id', async (req, res, next) => {
  const id = req.params.id;
  const session = await sessionModel.Session.findById(id).exec();

  if (!session) {
    return next(createHttpError(404, `Session ${id} not found`));
  }

  const playerId = uuid();
  if (!session.playerOneId) {
    session.playerOneId = playerId;
    await sessionModel.Session(session).save();
  } else if (!session.playerTwoId) {
    session.playerTwoId = playerId;
    await sessionModel.Session(session).save();
  } else {
    return next(createHttpError(400, `Session ${id} full`));
  }

  res.render('session', { title: 'BattleShips', id, playerId });
});

router.post('/session/:id/verify', async (req, res, next) => {
  const id = req.params.id;

  const session = await sessionModel.Session.findById(id).exec();

  if (!session) {
    return next(createHttpError(404, `Session ${id} not found`));
  }

  const playerId = req.body.playerId;
  const sessionPassword = req.body['session-password-input'];
  const playerName = req.body['session-name-input'];

  let playerOption;
  if (playerId === session.playerOneId) {
    playerOption = 'one';
  } else {
    playerOption = 'two';
  }

  if (session.password !== sessionPassword) {
    return res.render('session', { title: 'BattleShips', id, playerId, passwordFailed: true });
  }

  res.render('game', { title: 'BattleShips', playerName, playerOption });
});

router.post('/session/new', async (req, res, next) => {
  const id = uuid();
  const password = req.body['session-password-input'];

  await new sessionModel.Session({
    _id: id,
    password: password
  }).save();

  const url = `http://127.0.0.1:3000/session/${id}`;
  res.redirect(`/?url=${url}`);
});

module.exports = router;
