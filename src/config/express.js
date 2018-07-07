'use strict';

import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import sqldb from '../sqldb';
import expressSequelizeSession from 'express-sequelize-session';
import { authenticate } from '../auth/auth.service';
import * as acl from 'express-acl';
import config from './environment';

var Store = expressSequelizeSession(session.Store);

export default function(app){
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  
  // Persist sessions with sequelizeStore
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new Store(sqldb.sequelize)
  }));

  // Configure and Attach ACL
  acl.config(config.acl);
  app.use('/api/', authenticate(), acl.authorize);

}