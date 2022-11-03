const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    username: String,
    image: {
        type: Buffer,
        required: true

    },
    imageType: {
        type: String,
        required:true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    year:{
        type: String,
        
    }


});







//instead of using Post as the model name we will use heroku_rjdcf7wh
// module.exports = mongoose.model('Post',PostSchema)
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;