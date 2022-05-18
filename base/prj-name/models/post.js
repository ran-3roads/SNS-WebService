const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      like:{//좋아요 db
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      hate:{//싫어요 db
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sinceDate: { //작성한 날짜
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: new Date()
      },
      scope: {
        type: Sequelize.STRING(50),
        allowNull: true,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.hasMany(db.Emotion);
  }
};
