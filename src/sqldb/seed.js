'use strict';

import sqldb from '../sqldb';
var User = sqldb.User;

var adminUser = {
  provider: 'local',
  name: 'Alaa Wattar',
  email: 'admin@houseofmoda.co',
  password: 'admin',
  role: 'admin'
}

var testUser = {
  provider: 'local',
  name: 'Test User',
  email: 'test@houseofmoda.co',
  password: 'test',
  role: 'accountant'
}


User.sync()
  .then(() => User.destroy({where: {}}))
  .then(() => {
    User.bulkCreate([adminUser, testUser])
    .then(()=>{
      console.log('[seed] finished populating users.');
    })
  })