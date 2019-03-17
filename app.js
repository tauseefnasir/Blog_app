var bodyParser = require("body-parser"),
    express    = require("express"),
    mongoose   = require("mongoose"),
    app        = express();


    mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true });
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));

    var blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body:String,
        time:{type:Date ,default:Date.now}, 
    });

    var Blog = mongoose.model("Blog", blogSchema);

    // Blog.create({
    //     title: "test blog",
    //     body: "this is a test blog so i dont know what to write inside it so pardon senior",
    //     image: "https://images.unsplash.com/photo-1552653832-83cfe2ffa4af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    // });
app.get("/", (req, res) => {
    res.redirect("/blogs");
});
app.get("/blogs", (req, res) => {
    Blog.find({},(err, blogs) => {
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    })
    
})


    app.listen(3000);