var bodyParser       = require("body-parser"),
    express          = require("express"),
    mongoose         = require("mongoose"),
    methodOverride   = require("method-override"),
    expressSanitizer =require("express-sanitizer"),
    app              = express();


    mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true });
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));

    var blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        time:{type:Date ,default:Date.now}, 
    });

    var Blog = mongoose.model("Blog", blogSchema);

    // Blog.create({
    //     title: "test blog",
    //     body: "this is a test blog so i dont know what to write inside it so pardon senior",
    //     image: "https://images.unsplash.com/photo-1552653832-83cfe2ffa4af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    // });

    // index route
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
    });
    
});
// new route
app.get("/blogs/new", (req,res)=>{
    res.render("new");
});

// create rout
app.post("/blogs", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog)=>{

        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
// show 
app.get("/blogs/:id", (req, res)=>{
    // finding post 
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });

});
// edit route
app.get("/blogs/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
    
});
// update
app.put("/blogs/:id", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, uddatedBlog)=>{
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// delete
app.delete("/blogs/:id", (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

    app.listen(3000);