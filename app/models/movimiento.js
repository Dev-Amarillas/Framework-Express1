'use strict';


module.exports = (sequelize, DataTypes) => {
  const movimiento = sequelize.define('Movimiento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    voluntario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('ingreso', 'egreso'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_movimiento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    }
  }, {
    tableName: 'movimientos',
    timestamps: false
  });

  return movimiento;
};
