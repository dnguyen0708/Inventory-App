const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300,h_300');
});

const CategorySchema = new Schema(
    {
        name:{
            type: String,
            required:true
        },
        description:{
            type: String,
            maxlength: 100
        },
        image:ImageSchema
    }
);

CategorySchema.virtual('url').get(function(){
    return '/category/'+this._id;
});

module.exports = mongoose.model('Category',CategorySchema);