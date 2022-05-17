var express = require('express');
var router = express.Router();
const passport = require("passport");
const user_controller = require('../controllers/userController');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Index Page' });
});

router.get('/sign-up',(req,res)=>{ res.render('users/register')});

router.post('/sign-up',user_controller.user_create_post);

router.get('/login',(req,res)=>{ res.render('users/login')});

router.post('/login',    
  passport.authenticate("local", {
    successRedirect: "/category",
    failureRedirect: "/category"
  })
);

router.get('/logout',(req,res)=> { req.logout(); res.redirect('/');});

module.exports = router;
