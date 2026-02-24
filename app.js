require('dotenv').config()
const express = require('express');
const app = express();
const constToDatabase = require('./database');
constToDatabase();
const Blog = require('./models/blogModel');


app.listen(process.env.PORT, ()=>{
    console.log("My name is Milan Rai");
});

//API to get all blogs
app.get("/blog", async(req, res) =>{
    const blogs = await Blog.find(); //find, return the value in array
    res.status(200).json({
        message : "Blogs fetch successfully!"
    })

})