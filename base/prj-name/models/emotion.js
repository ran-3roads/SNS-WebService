const Sequelize = require('sequelize');

module.exports = class Emotion extends Sequelize.Model {//감정표현 객체 
  static init(sequelize) {
    return super.init({
        emotion: {//감정표현 상태
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

  static associate(db) {//foreign key둘
    db.Emotion.belongsTo(db.Post);
    db.Emotion.belongsTo(db.User);
  }
};
