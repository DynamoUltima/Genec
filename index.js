const path = require('path');
const express = require('express');

const app = new express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");


const expressLayouts = require('express-ejs-layouts');

const bodyParser = require('body-parser');


const Post = require('./database/models/post');



const fileUpload = require("express-fileupload");
//const URI = require('./config')




app.use(fileUpload());
app.use(express.static('public'));
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

dotenv.config();

const MONGODB_URI = "mongodb+srv://dynamo:genectest201@cluster0.wvnuz.mongodb.net/genec-blog?retryWrites=true&w=majority"






const PORT = process.env.PORT || 4000;

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gifs']






mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => { console.log("successful connection to database") }).catch(err => { console.log(err) });


mongoose.connection.on('error', err => {
    console.log(`Db connection error: ${err.message}`)
}).catch(err => { console.log(err) });



app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/services', (req, res) => {
    res.render('services');
});

app.get('/blog/:page', async function (req, res) {

    var perPage = 9;
    var page = req.params.page || 1;


    Post.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(async function (err, post) { 
            const blogInfo =await Post.aggregate(
                [
                    { $match: {} },
                    { $group: { _id: "$year", dateCounts: { $sum:1  } } },

                ]
            ).exec();

            
            console.log(blogInfo)

           


            Post.countDocuments().exec(function (err, count) {
                if (err) return next(err)




                res.render('blog', {
                    posts: post,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    blogInfo

                })
            })




        })


});

app.get('/contact', (req, res) => {
    res.render('contact');
});

//instead of using domain we are going to be use url Domain so that we can deploy
app.get('/blog-details/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    let domain = PORT//'http://localhost:3000'
    res.render('blog-details', {
        post, domain
    })
});

app.get('/blog-archives/:year', async (req, res) => {

    const year = req.params.year
    const post = await Post.find({year:year})

    



    res.render('blog-archives', { posts: post })
});



app.get('/create', (req, res) => {
    res.render('create',);
});

app.get('/faq', (req, res) => {
    res.render('faq');
});


app.post("/posts/store", async (req, res) => {

    try {
      

        const { title, description, content, username } = req.body;
        let year =new Date().getFullYear()
        // console.log(year)
        const post = new Post({
            title,
            description,
            content,
            username,
            year 
        })


        saveCover(post, req.body.image);

        await post.save((err, post) => {
            if (err) {
                console.log(err)
                return
            }

            res.redirect('/blog/1')
        });
        // res.redirect('/create')

    } catch (error) {
        console.log(error.message)
        // res.redirect('/create')
    }



});


function saveCover(post, imageEncoded) {

    if (imageEncoded == null) return

    const image = JSON.parse(imageEncoded);
    if (image != null && imageMimeTypes.includes(image.type)) {
        post.image = new Buffer.from(image.data, 'base64');
        post.imageType = image.type
    }

}








app.listen(PORT, () => {

    console.log('App listening on port 4000')
});
