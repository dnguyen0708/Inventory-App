const Category = require('../models/category');
const Product = require('../models/product');
const { body, validationResult} = require('express-validator');
const multer = require('multer');
const { storage, cloudinary  } = require('../cloudinary');
const upload = multer({ storage });
const async = require('async');

exports.all_categories = function(req,res,next){

    Category.find({}).exec(function(err,category){
        if(err) return next(err);
        res.render('categories',{title:"Categories",category:category});
    });
};

exports.category_detail = function(req,res,next){

    async.parallel(
        {
            products: function(cb){
                Product.find({'category':req.params.id},'name image')
                    .exec(cb);
            },
            category: function(cb){
                Category.findById(req.params.id)
                    .exec(cb);
            }
        },
        function(err,results){
            if(err) return next(err);
            res.render('category',{category:results.category,products:results.products});
        }
    );

}

exports.category_create_get = function(req,res,next){
    res.render('category_form',{title:"Create Category"});
}


exports.category_create_post = [
    upload.single('image'),
    body('name','Name must not be empty').trim().isLength({min:1}).escape(),
    body('description','Description must not be empty').trim().isLength({min:1}).escape(),

    async (req,res,next)=>{
        const errors = validationResult(req);
        const category = new Category(
            {
                name: req.body.name,
                description: req.body.description,
                image: {
                    url: req.file.path,
                    filename: req.file.filename
                }
            }
        );

        if(!errors.isEmpty()){
            await cloudinary.uploader.destroy(req.file.filename);
            res.render('category_form',{title:"Create Category",category:category,errors:errors.array()});
            return;
        }
        
        category.save(function(err){
            if(err) return next(err);
            res.redirect('/category');
        });
    }
];

exports.category_update_get = function(req,res,next){
    Category.findById(req.params.id).exec(function(err,category){
        if(err) return next(err);
        res.render('category_form',{title:"Update Category",category:category});
    });
    
}

exports.category_update_post = [
    upload.single('image'),
    body('name','Name must not be empty').trim().isLength({min:1}).escape(),
    body('description','Description must not be empty').trim().isLength({min:1}).escape(),

    async(req,res,next)=>{
        const errors = validationResult(req);
        let image;
        if(typeof req.file == 'undefined'){
            image = {
                url: req.body.imageurl,
                filename: req.body.imagename
            }
        }else{
            image = {
                url: req.file.path,
                filename: req.file.filename
            }
        }
        const category = new Category(
            {
                name: req.body.name,
                description: req.body.description,
                image: image,
                _id: req.params.id
            }
        );

        if(!errors.isEmpty()){
            await cloudinary.uploader.destroy(req.file.filename);
            res.render('category_form',{title:"Create Category",category:category,errors:errors.array()});
            return;
        }else{
            await cloudinary.uploader.destroy(req.body.imagename);
            Category.findByIdAndUpdate(req.params.id,category,{},function(err){
                if(err) return next(err);
                res.redirect('/category');
            });
        }

    }
];

exports.category_delete_get = function(req,res,next){
    async.parallel(
        {
            products: function(cb){
                Product.find({'category':req.params.id},'name')
                    .exec(cb);
            },
            category: function(cb){
                Category.findById(req.params.id)
                    .exec(cb);
            }
        },
        function(err,results){
            if(err) return next(err);
            res.render('category_delete',{category:results.category,products:results.products});
        }
    );
}

exports.category_delete_post = function(req,res,next){
    async.parallel(
        {
            products: function(cb){
                Product.find({'category':req.body.categoryid},'name')
                    .exec(cb);
            },
            category: function(cb){
                Category.findById(req.body.categoryid)
                    .exec(cb);
            }
        },
        async function(err,results){
            if(err) return next(err);
            if(results.products.length){
                res.render('category_delete',{category:results.category,products:results.products});
            }
            await cloudinary.uploader.destroy(req.body.imagename);
            Category.findByIdAndRemove(req.params.id,function(err){
                if(err) return next(err);
                res.redirect('/category');
            });
        }
    );
}