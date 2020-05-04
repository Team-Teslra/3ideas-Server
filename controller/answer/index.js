const post = require('./post');
const get = require('./get');
const patch = require('./patch');
const remove = require('./delete');

module.exports = { post, get, patch, delete: remove };
