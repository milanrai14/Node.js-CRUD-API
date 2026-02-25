require('dotenv').config()
const express = require('express');
const app = express();
const constToDatabase = require('./database');
constToDatabase();
const Blog = require('./models/blogModel');
const {multer, storage} = require('./middleware/multerConfig')
const upload = multer({storage : storage})
const fs = require('fs');
const { isMainThread } = require('worker_threads');
app.use(express.json())

app.listen(process.env.PORT, ()=>{
    console.log("My name is Milan Rai");
});

//API for POST
app.post("/blog", upload.array("images"), async (req, res) => { //upload.single("image") for single image
    const { title, description } = req.body;

    // // Optional image for single image
    // const image = req.file ? req.file.filename : null;
    // for multiple images
    const images = req.files ? req.files.map(file => file.filename) : [];


    console.log(req.body);
    console.log(req.files);

    // Validation
    if (!title || !description) {
        return res.status(400).json({
            message: "Provide title and description"
        });
    }

    await Blog.create({
        title: title,
        description: description,
        images: images
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
//API to Update
app.patch("/blog/:id",upload.single('image'), async(req, res)=>{
    const id = req.params.id;
    const{title, description} = req.body;
    let imageName;
    if (req.file){
        imageName = req.file.filename
        const blog = await Blog.findById(id);
        const oldImage = blog.image //oldimage
        fs.unlink(`storage/${oldImage}`, (err)=>{
            if (err){
                console.log(err)
            } else {
                console.log("File Deleted successfully")
            }
        })
    }
    // this update the blog
    await Blog.findByIdAndUpdate(id, {
        title : title,
        description : description,
        image : imageName
    })
    res.status(200).json({
        message : "Update Successfully"
    })
    
})

//API to delete the blog
// app.delete("/blog/:id", upload.single('image'), async(req, res)=>{
//     const id = req.params.id;
//     const blog = await Blog.findById(id);
//     const imageName = blog.image;
//     fs.unlink(`storage/${imageName}`, (err)=>{
//         if (err){
//             console.log(err)
//         } else {
//             console.log("Image Successfully!")
//         }
//     });
//     await Blog.findByIdAndDelete(id);
//     res.status(200).json({
//         message : "Blog Delete Successfully"
//     });
// });

//API to delete the blog
app.delete('/blog/:id', async(req, res)=>{
    const id = req.params.id;
    const blog = Blog.findById(id);

    if(!blog){
        res.status(400).json({
            message : "Data not found"
        });
    }
    const imageName = blog.image;
    //delete image
    fs.unlink(`storage/${imageName}`, (err)=>{
        if (err){
            console.log(err)
        } else {
            console.log("Image delete successfully!")
        }
    })
    //delete blog
    await Blog.findByIdAndDelete(id);
    res.status(200).json({
        message : "Blog delete successfully!"
    })
})