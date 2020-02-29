const { blacklist } = require('../models');
const jwt = require('jsonwebtoken');

//? 유효한 token이 있는지 확인 => 유효한 token이 없으면 return next()
module.exports = (req, res, next) => {
  if (req.cookies.token) {
    //? 이미 발급받은 토큰이 존재함
    const token = req.cookies.token;

    blacklist
      .findOne({ where: { token } })
      .then(result => {
        if (result) {
          //! blacklist에 올라간 token
          return next();
        }

        //? 유효한 토큰인지 확인
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
          if (decoded) {
            //! 유효한 토큰
            return res.status(401).json('you have token');
          }
          return next();
        });
      })
      .catch(err => {
        return res.status(400).json(`error name: ${err.name}`);
      });
  } else {
    return next();
  }
};
