const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {//감정표현 객체 
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comment',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {//foreign key둘
    db.Comment.belongsTo(db.Post);
    db.Comment.belongsTo(db.User);
  }
};
