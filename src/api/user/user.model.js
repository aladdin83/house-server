'use strict';

import crypto from 'crypto';

module.exports = function(sequelize, DataTypes){
  var User = sequelize.define('User',{
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The specified address already in use.'
      },
      validate: {
        isEmail:true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    salt: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'cashier', 'accountant', 'storekeeper', 'production_manager']
    }
  })
}