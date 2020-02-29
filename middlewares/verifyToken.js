const { blacklist } = require('../models');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    //? token이 존재하지 않음
    return res.status(400).json(`token isn't exist`);
  }

  blacklist
    .findOne({ where: { token } })
    .then(result => {
      if (result) {
        //! blacklist에 올라간 token
        return res.status(401).json('token is not verify');
      }

      try {
        req.decoded = jwt.verify(token, process.env.SECRET_KEY);
        return next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json('token is already expired');
        }

        return res.status(401).json(`invalid token. error name: ${err.name}`);
      }
    })
    .catch(err => {
      return res.status(400).json(`error name: ${err.name}`);
    });
};
