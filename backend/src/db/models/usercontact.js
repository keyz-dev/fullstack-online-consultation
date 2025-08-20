'use strict';
const {
  Model
} = require('sequelize');

const User = require('./user');
const ContactInformation = require('./contactinformation');
module.exports = (sequelize, DataTypes) => {
  class UserContact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserContact.belongsTo(models.User, {foreignKey: 'userId'})
      UserContact.belongsTo(models.ContactInformation, {foreignKey: 'contactInformationId'})
    }
  }
  UserContact.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    contactInformationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ContactInformation,
        key: 'id'
      },
      primaryKey: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'UserContact',
  });
  return UserContact;
};