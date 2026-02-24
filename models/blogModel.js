const mongoose = require('mongoose');
const Schema = mongoose.Schema

const blogSchema = new Schema(
    {
        title: {
            type : String
        },
        description : {
            type : String
        },
        image : {
            type : String
        }
    },
    {
        timestamps : true //created and updated automatically
    }
);

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog