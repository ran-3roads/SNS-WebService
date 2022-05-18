const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Emote = require('../common/emote');

const { Post, Hashtag, Emotion } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log(req.user);
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
      scope: req.body.scope,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.post('/like', isLoggedIn, upload2.none(), async (req, res, next) => {//좋아요 눌렀을때
  try {
    Emotion.find
    const emotion = await Emotion.findOrCreate({
      where: { PostId: req.id, UserId: req.user.id },
      defaults: {
        emotion: Emote.LIKE,
        PostId: req.id,
        UserId: req.user.id,
      },
    });
    const post = await Post.findByPk(req.id);
    if(emotion[1]){
      await post.increment({like:1});
    }
    else if(!emotion[1] && emotion[0].emotion==Emote.HATE){
      await emotion[0].update({emotion:Emote.LIKE});
      await post.increment({like:1});
      await post.decrement({hate:1});
    }
    else{
      emotion[0].destroy();
      await post.decrement({like:1});

    }
      res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/hate', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    Emotion.find
    const emotion = await Emotion.findOrCreate({
      where: { PostId: req.id, UserId: req.user.id },
      defaults: {
        emotion: Emote.HATE,
        PostId: req.id,
        UserId: req.user.id,
      },
    });
    const post = await Post.findByPk(req.id);
    if(emotion[1]){
      await post.increment({hate:1});
    }
    else if(!emotion[1] && emotion[0].emotion==Emote.LIke){
      await emotion[0].update({emotion:Emote.HATE});
      await post.increment({hate:1});
      await post.decrement({like:1});
    }
    else{
      emotion[0].destroy();
      await post.decrement({hate:1});

    }
      res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
