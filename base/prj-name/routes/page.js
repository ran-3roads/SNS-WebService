const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag, Comment } = require('../models');
const Op = require('sequelize').Op



const router = express.Router();
router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: 'Profile - prj-name' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: 'Join to - prj-name' });
});

// router.get('/photoBook', async (req, res, next) => {
//   try {
//     console.log("실행됨");
//     if (req.user != undefined) {
//       const imgPosts = await Post.findAll({
//         where: {img:{[Op.ne]: null},UserId: req.user.id},
//         order: [['createdAt', 'DESC']],
//         attributes: ['img','id'],
//       });
//       res.render('layout', {
//         title: 'prj-name',
//         imgPosts: imgPosts,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: [{//연관관계인 user도 포함시킴 
        model: User,
        attributes: ['id', 'nick'],
      }, {
        model: Comment,//연관관계인 Comment들을 포함시킴 
        include: [{
          model: User,
          attributes: ['id', 'nick'],
        }],
        order: [['createdAt', 'DESC']],//날짜순 정렬
      }],
      order: [['createdAt', 'DESC']],//날짜순 정렬 
    });
    if (req.user != undefined) {//유저 로그인되어있는지 여부 확인
      const imgPosts = await Post.findAll({
        where: {
          img:{
            [Op.ne]: null//null이 아닌것만 검색
          },
          UserId: req.user.id
        },
        order: [['createdAt', 'DESC']],
        attributes: ['img','id'],
      });
      res.render('main', {
        title: 'prj-name',
        twits: posts,
        imgPosts: imgPosts,//이미지가 있는 포스트 배열
      });
    }
    else {
      res.render('main', {
        title: 'prj-name',
        twits: posts,
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});



router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
router.get('/since', async (req, res, next) => {
  const query = req.query.sinceDate;
  console.log(query);
  if (!query) {
    return res.redirect('/');
  }
  try {
    const sincedate = await Post.findAll({ where: { sinceDate: query } });
    let posts = [];
    if (sincedate) {
      posts = await sincedate;
    }
    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/img', async (req, res, next) => {
  const query = req.query.post;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const post = await Post.findAll(
      { include: [{
        model: User,
        attributes: ['id', 'nick'],
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nick'],
        }],
        //        attributes: [], 사용해보고 필요없느거 있으면 그때 제외
        order: [['createdAt', 'DESC']],
      }],
        where : {id:query},
      });
    

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: post,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
