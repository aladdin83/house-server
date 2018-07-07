import express from 'express';
import http from 'http';
import config from './config/environment';
import sqldb from './sqldb';
import expressConfig from './config/express';


var app = express();
var server = http.createServer(app);
expressConfig(app);
require('./routes').default(app);


// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}
sqldb.sequelize.sync()
.then(startServer)
.catch((err)=>{
  console.log('Server failed to start due to error: %s', err);
})


// Expose app
exports = module.exports = app;
