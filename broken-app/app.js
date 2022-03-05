const express = require('express');

const axios = require('axios');

const ExpressError = require('./expressError');

const app = express();

app.use(express.json());

app.post('/', function(req, res, next) {
  if (!req.body.developers) throw new ExpressError('A name is require', 400);
    const devInfo = req.body.developers.map(async (dev) => {
      try {
      const res = await axios.get(`https://api.github.com/users/${dev}`);
      if (res.status !== 404) {
        return {
          bio : res.data.bio,
          name: res.data.name,
        };
    }
  } catch {
    return {message: "No user by this name"};
  }
});
  Promise.all(devInfo).then((data) => {
    return res.status(200).json(data);
  })
});


app.use(function (req, res, next) {
  const notFoundError = new ExpressError("Could not be found", 404);
  return next(notFoundError)
});


app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;
  return res.status(status).json({
    error: {message, status}
  });
});


app.listen(3000,  () => {
  console.log('App on port 3000');
});
