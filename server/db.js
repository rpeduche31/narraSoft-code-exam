let mongoose = require('mongoose');
let User = require('./resources/user/UserModel');
let logger = global.logger;

module.exports = function(config) {
  mongoose.Promise = global.Promise; // mongoose internal Promise library depreciated; use native
  mongoose.connect(config.db, {
    useMongoClient: true,
  });
  var db = mongoose.connection;
  db.on('error', logger.error.bind(console, 'mongo connection error'));
  db.once('open', function callback() {
    logger.debug('mongo connection opened');
  });

  // any other initial model calls
  User.createDefaults();
  Flow.createDefaults();
};

// Yote models are defined below
let Task = require('./resources/task/TaskModel');
let Flow = require('./resources/flow/FlowModel');
let Note = require('./resources/note/NoteModel');