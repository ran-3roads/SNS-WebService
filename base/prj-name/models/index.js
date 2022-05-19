const Sequelize = require('sequelize');
//시퀄라이즈 설정들
const env = process.env.NODE_ENV || 'development';
//key가 development인것의 value를 가져온다.
const config = require('../config/config')[env];
//entity들 
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');
const Emotion = require('./emotion');
const Comment = require('./comment');
//db 빈객체
const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);
//빈객체에 엔티티와 sequelize 할당
db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.Emotion = Emotion;
db.Comment = Comment;
//각 모델에서 정의한 init 함수 호출 db가 없으면 자동으로 만들어주고 연동
User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Emotion.init(sequelize);
Comment.init(sequelize);
//관계를 정의한다.
User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Emotion.associate(db);
Comment.associate(db);
module.exports = db;