const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const { body, validationResult} = require('express-validator');
const multer = require('multer');
const { storage, cloudinary  } = require('../cloudinary');
const upload = multer({ storage });
const async = require('async');

exports.all_products = function(req,res,next){
    Product.find({}).exec(function(err,products){
        if(err) return next(err);
        res.render('products',{title:"All Products",products:products});
    });
}

exports.product_detail = function(req,res,next){

    Product.findById(req.params.id)
        .populate('category')
        .exec(function(err,product){
            if(err) return next(err);
            res.render('product_detail',{title:product.name,product:product});
        });
}

exports.product_create_get = function(req,res,next){

    Category.find({}).exec(function(err,category){
        if(err) return next(err);
        res.render('product_form',{title:"Create Product",category:category});
    });
}

exports.product_create_post = [
    upload.single('image'),
    body('name','Name must not be empty').trim().isLength({min:1}).escape(),
    body('description','Description must not be empty').trim().isLength({min:1}).escape(),
    body('price','Price must not be empty').trim().isLength({min:1}).isFloat().withMessage('price must be number'),
    body('inStock','Instock must not be empty').trim().isLength({min:1}).isInt({min:1, max:1000}),
    body('category','Category must not be empty').exists(),

    async (req,res,next)=>{

        const errors = validationResult(req);
        const product = new Product(
            {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price:req.body.price,
                inStock:req.body.inStock,
                owner:res.locals.currentUser,
                image: {
                    url: req.file.path,
                    filename: req.file.filename
                }
            }
        );
        if(!errors.isEmpty()){
            await cloudinary.uploader.destroy(req.file.filename);
            Category.find({}).exec(function(err,category){
                if(err) return next(err);
                res.render('product_form',{title:"Create Product",
                category:category,
                product:product,
                errors:errors.array()});
                return;
            });
        }
        else{
            product.save(function(err){
                if(err) return next(err);
                res.redirect(product.url);
            })
        }

    }
    
];

exports.product_update_get = function(req,res,next){
    async.parallel(
        {
            product: function(cb){
                Product.findById(req.params.id)
                    .populate('category')
                    .exec(cb);
            },
            category: function(cb){
                Category.find({}).exec(cb);
            }
        },
        function(err,results){
            if(err) return next(err);
            for(let cat of results.category){
                if(cat._id.equals(results.product.category._id))
                cat.checked = true;
            }
            res.render('product_form',{title:"Update Product",
                product:results.product,
                category:results.category});
        }
    );
}

exports.product_update_post = [
    upload.single('image'),
    body('name','Name must not be empty').trim().isLength({min:1}).escape(),
    body('description','Description must not be empty').trim().isLength({min:1}).escape(),
    body('price','Price must not be empty').trim().isLength({min:1}).isFloat().withMessage('price must be number'),
    body('inStock','Instock must not be empty').trim().isLength({min:1}).isInt({min:1, max:1000}),
    body('category','Category must not be empty').exists(),

    async (req,res,next)=>{
        try{        
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
            // console.log(req.body.name.replace(new RegExp("&"+"#"+"x27;", "g"), "'"));
            const product = new Product(
                {
                    name: req.body.name,
                    description: req.body.description,
                    category: req.body.category,
                    price:req.body.price,
                    inStock:req.body.inStock,
                    owner:res.locals.currentUser,
                    image: image,
                    _id: req.params.id
                }
            );
            if(!errors.isEmpty()){
                await cloudinary.uploader.destroy(req.file.filename);
                Category.find({}).exec(function(err,category){
                    if(err) return next(err);
                    res.render('product_form',{title:"Create Product",
                    category:category,
                    product:product,
                    errors:errors.array()});
                    return;
                });
            }
            else{
                await cloudinary.uploader.destroy(req.body.imagename);
                Product.findByIdAndUpdate(req.params.id,product,{},function(err,product){
                    if(err) return next(err);
                    res.redirect(product.url);
                });
            }

        }catch(err){
            return next(err);
        }
    }
];

exports.product_delete_get = function(req,res,next){
    
    Product.findById(req.params.id)
        .populate('category')
        .exec(function(err,product){
            if(err) return next(err);
            res.render('product_delete',{product:product});
        });
}

exports.product_delete_post = async function(req,res,next){
    try{
        console.log(req.body.imagename);
        await cloudinary.uploader.destroy(req.body.imagename);
        Product.findByIdAndRemove(req.params.id,function(err){
            if(err) return next(err);
            res.redirect('/products');
        });
    }catch(err){
        return next(err);
    }

}