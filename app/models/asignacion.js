'use strict';

module.exports = (sequelize, DataTypes) => {
  const asignacion = sequelize.define('Asignacion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    voluntario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_asignacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'asignaciones',
    timestamps: false
  });

  return asignacion;
};
