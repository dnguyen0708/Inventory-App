const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
});

const ProductSchema = new Schema(
    {
        name:{
            type: String,
            required:true
        },
        description:{
            type: String,
            required:true
        },
        category:{
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        price:{
            type: Number,
            required:true
        },
        inStock:{
            type:Number,
            require:true
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        image: ImageSchema
    }
);

ProductSchema.virtual('url').get(function(){
    return '/products/'+this._id;
});

module.exports = mongoose.model('Product',ProductSchema);