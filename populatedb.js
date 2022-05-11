#! /usr/bin/env node

console.log('Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

var async = require('async')
const Category = require('./models/category');
const Product = require('./models/product');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const products = []
const category = []

function productCreate(name,desc,category,price,inStock,cb){
    productdetail = {
        name:name,
        description: desc,
        category: category,
        price: price,
        inStock: inStock,
        image:{url:'https://res.cloudinary.com/dpofkfwhq/image/upload/v1652215599/oda3xmahwyiyzeodgzbn.jpg',filename:'oda3xmahwyiyzeodgzbn'}
    }

    const newProduct = new Product(productdetail);
    newProduct.save(function(err){
        if(err){
            cb(err,null);
            return;
        }
        console.log('New Product: '+ newProduct);
        products.push(newProduct);
        cb(null,newProduct);
    });
}

function categoryCreate(name,desc='',cb){
    const categorydetail = {
        name:name,
        description: desc,
        image:{url:'https://res.cloudinary.com/dpofkfwhq/image/upload/v1652215599/oda3xmahwyiyzeodgzbn.jpg',filename:'oda3xmahwyiyzeodgzbn'}
    }
    const newCategory = new Category(categorydetail);
    newCategory.save(function(err){
        if(err){
            cb(err,null);
            return;
        }
        console.log('New Category: '+ newCategory);
        category.push(newCategory);
        cb(null,newCategory);
    });
}

function createCategory(cb){
    async.series(
        [
            function(cb){
                categoryCreate('Shoes','find all kind of shoes here',cb);
            },
            function(cb){
                categoryCreate('Shirts','Shirts are cool',cb);
            },
            function(cb){
                categoryCreate('Hats','Hats are cool',cb);
            },
            function(cb){
                categoryCreate('Pants','Pants are cool',cb);
            },
            function(cb){
                categoryCreate('Jacket','Jackets are cool',cb);
            },
        ],
        cb
    );
}

function createProduct(cb){
    async.parallel(
        [
            function(cb){
                productCreate("Men's Long-Sleeve Regular-fit Casual Poplin Shirt","Crisp poplin fabric and a sophisticated check pattern make this long-sleeve button-up shirt a go-to pick for any occasion",category[1],8.99,20,cb);
            },
            function(cb){
                productCreate("Under Armour Men's Tech 2.0 Short-Sleeve T-Shirt","UA Tech fabric is quick-drying, ultra-soft & has a more natural feel",category[1],19.99,30,cb);
            },
            function(cb){
                productCreate("Troadlop Men's Running Shoes Non Slip Shoes Breathable Lightweight Sneakers","Mesh upper offers a snug, sock-like fit, comfortable, breathable and lightweight. Knit material makes it possible that your feet free breath when you run or walk. Soft and protective to cushion your every step",category[0],43.99,12,cb);
            },
            function(cb){
                productCreate("New Balance Men's Made in Us 990 V5 Sneaker","Heritage Style: The 990v5 is an iconic sneaker, built with a pigskin and mesh upper in a classic running silhouette designed to look amazing anywhere from morning run to runway",category[0],184.95,77,cb);
            },
            function(cb){
                productCreate("VIONLAN Baseball Cap American Flag Trucker Hat for Men Women 3D Embossed Logo Adjustable Outdoor Mesh Snapback Hat","High Quality Materials - The front panels of the hat are made with 100% cotton twill,fit, breathable and comfortable, The structured polyester mesh back panels are rugged and won't tear or fade over time,exceptional quality.",category[2],15.28,80,cb);
            },
            function(cb){
                productCreate("Top Level Beanie Men Women - Unisex Cuffed Plain Skull Knit Hat Cap","Adjustable and Comfortable: The cuffed beanie cap and hat come in all size that can be adjusted on men and women head with comfort and coziness.",category[2],9.99,40,cb);
            },
            function(cb){
                productCreate("min High Waist Yoga Pants Leggings with Pockets","BASIC BLACK LEGGINGS : comfortable and indulge in a pair of ultra-soft leggings. Featuring an elasticated fit and curve hugging shape, these simple leggings are completely staple.",category[3],18.90,69,cb);
            },
            function(cb){
                productCreate("Levi's Men's 505 Regular Fit Jeans","100% Cotton, imported, Machine wash jeans inside out with like colors using liquid detergent",category[3],69.42,96,cb);
            },
            function(cb){
                productCreate("chouyatou Men's Casual Color-Block Patches Full Zip Fleece Lined Pu Leather Varsity Bomber Jacket","Fabric: high quality pu leather; Lining: 100% Polyester - Hand Wash or Dry Clean",category[4],46.98,35,cb);
            },
            function(cb){
                productCreate("Wrangler Authentics Women's Authentics Denim Jacket","WARDROBE STAPLE. Come rain or shine, a classic denim jacket will always have your back. This stylish take on a wardrobe staple is designed to complete any look. Best of all, it will never go out of style.",category[4],56.78,65,cb);
            },
        ],
        cb
    );
}

async function resetDB(){
    await Category.deleteMany({});
    await Product.deleteMany({});
}

async.series([
    resetDB,
    createCategory,
    createProduct
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



