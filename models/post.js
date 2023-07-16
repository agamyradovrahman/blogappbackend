const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        default: "Admin",
    },
    image:
        {
            type: Object,
            public_id:{
                type: URL
                
            },
            url:{
                type:String,
                
            },
        }
    ,
    category:{
        type: String,
        required:[true,"Please add a category of your product"],
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Post', postSchema)