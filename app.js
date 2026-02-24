require('dotenv').config()
const express = require('express');
const app = express();
const constToDatabase = require('./database');
constToDatabase();
const Blog = require('./models/blogModel');
const {multer, storage} = require('./middleware/multerConfig')
const upload = multer({storage : storage})
const fs = require('fs')
app.use(express.json())

app.listen(process.env.PORT, ()=>{
    console.log("My name is Milan Rai");
});

//API for POST
app.post("/blog", upload.single("image"), async (req, res) => {
    const { title, description } = req.body;

    // Optional image
    const image = req.file ? req.file.filename : null;

    console.log(req.body);
    console.log(req.file);

    // Validation
    if (!title || !description) {
        return res.status(400).json({
            message: "Provide title and description"
        });
    }

    await Blog.create({
        title: title,
        description: description,
        image: image
    });

    res.status(201).json({
        message: "Blog POST API Create Successfully!"
    });
});
//API to get all blogs
app.get("/blog", async(req, res) =>{
    const blogs = await Blog.find(); //find, return the value in array
    res.status(200).json({
        message : "Blogs fetch successfully!",
        data : blogs
    })

})
//API to get a single blog
app.get("/blog/:id", async(req, res)=>{
    const id = req.params.id;
    const blog = await Blog.findById(id); //single data retrive as object
    if (!blog){
        return res.status(404).json({
            message : "No data found"
        })
    }
    res.status(200).json({
        message : "Single data fetched successfully",
        data : blog
    })
})