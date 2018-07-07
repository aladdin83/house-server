'use strict';

import path from 'path';

export default function(app){
  app.use('/api/',require('./api/info/'))
}