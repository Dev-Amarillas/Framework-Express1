'use strict';

module.exports = (sequelize, DataTypes) => {
  const area = sequelize.define('Area', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'areas',
    timestamps: false
  });

  return area;
};
