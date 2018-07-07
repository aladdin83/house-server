'use strict';

module.exports = {
  sequelize:{
    uri: 'postgres://aladdin@localhost:5432/houseERP-dev',
    options:{
      logging: function(data){
        //console.log(data);
      },
      define:{
        timestamps: true,
      }
    }
  }
}