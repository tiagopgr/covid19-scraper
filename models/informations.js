'use strict';
module.exports = (sequelize, DataTypes) => {
  const Informations = sequelize.define('Informations', {
    //id: DataTypes.INTEGER,
    confirmadosbr: DataTypes.INTEGER,
    obitosbr: DataTypes.INTEGER,
    confirmadosce: DataTypes.INTEGER,
    obitosce: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
  }, {
    timestamps: false
  });
  Informations.associate = function(models) {
    // associations can be defined here
  };
  return Informations;
};