'use strict';

import crypto from 'crypto';

function validatePrecenseOf(value){
  return value && value.length;
}

module.exports = function(sequelize, DataTypes){
  var User = sequelize.define('User',{
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
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
    provider: DataTypes.STRING,
    salt: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'cashier', 'accountant', 'storekeeper', 'production_manager']
    }
  },{
    /**
     * Virtual Getters
     */
    getterMethods: {
      profile: function(){
        return {
          'name': this.name,
          'role': this.role
        };
      },
      
      // Non-sensitive info we'll be putting in the token
      token: function(){
        return {
          '_id': this._id,
          'role': this.role
        };
      }
    },

    hooks: {
      beforeBulkCreate: function(users, options) {
        for(let user of users){
          user.updatePassword();
        }
      },
      beforeCreate: function(user, options){
        user.updatePassword(function(err){
          if(err){
            throw new Error("password update failed.");
          }
        });
      },
      beforeUpdate: function(user, options){
        if(user.changed('password')){
          return user.updatePassword(function(err){
            throw new Error("password update failed.");
          });
        }
      }
    },

    
  });



    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    User.prototype.authenticate = function(password, callback){
      if(!callback){
        return this.paasword === this.encryptPassword(password);
      }

      var _this = this;
      this.encryptPassword(password, function(err, pwdGen){
        if(err){
          callback(err);
        }

        if(_this.password === pwdGen){
          callback(null, true);
        }else{
          callback(null, false);
        }
      });
    },
    /**
     * Make salt
     *
     * @param {Number} byteSize Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    User.prototype.makeSalt = function(byteSize){
      var defaultByteSize = 16;
      
      if(!byteSize){
        byteSize = defaultByteSize;
      }
      return crypto.randomBytes(byteSize).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    User.prototype.encryptPassword = function(password, callback){
      if(!password || !this.dataValues.salt){
        if(!callback){
          return null;
        }
        return callback(null);
      }
      

      var defaultIterations = 10000;
      var defaultKeyLength = 64;
      var salt = new Buffer(this.dataValues.salt, 'base64');
      if(!callback){
        return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha256')
                     .toString('base64');
      }
      return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha256', 
        function(err, key){
        if(err){
          callback(err);
        }
        return callback(null, key.toString('base64'));
      });
    },

    /**
     * Update password field
     *
     * @param {Function} fn
     * @return {String}
     * @api public
     */
    User.prototype.updatePassword = function(){
      // Handle new/update passwords
      if(this.password){
        if(!validatePrecenseOf(this.password)){
          fn(new Error('Invalid password'));
        }

        //Make salt with callback
        this.salt = this.makeSalt();
        this.password = this.encryptPassword(this.password)
    }
  }

  return User;
};