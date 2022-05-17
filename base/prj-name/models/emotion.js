const Sequelize = require('sequelize');

module.exports = class Emotion extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        emotion: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Emotion',
      tableName: 'emotions',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Emotion.belongsTo(db.Post);
    db.Emotion.belongsTo(db.User);
  }
};
