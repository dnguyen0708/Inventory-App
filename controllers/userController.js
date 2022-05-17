const User = require('../models/user');
const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

exports.user_create_post = [
    body('username','username must not be blank!').trim().isLength({min:1}).escape(),
    body('password','password must not be blank!').trim().isLength({min:4}).withMessage("password must have at least 5 characters").escape(),
    
    (req,res,next)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('users/register',{errors:errors.array()});
            return;
        }

        bcrypt.hash(req.body.password,10,(err,hashedPassword)=>{
            if(err) return next(err);
            const user = new User(
                {
                    username: req.body.username,
                    password: hashedPassword
                }
            ).save(err =>{
                if(err) return next(err);
                res.redirect('/category');
            });
        });
    }
];