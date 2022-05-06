var express = require("express"),
	app = express(), 
	bodyParser = require("body-parser"),
	mongoose =require("mongoose");

mongoose.connect("mongodb+srv://dbeman:123456789password@cluster0-lmz6o.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser: true,
	useCreateIndex: true
     }).then(() => {
	console.log('Connected to DB!');
       }).catch(err => {
	console.log('ERROR:', err.message);
          });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date, default:Date.now}
});
var blog = mongoose.model("blog", blogSchema);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	blog.find({}, function(err, blog){
       if(err)
           console.log(err);
       else 
          res.render("index",{blog:blog});
	});
    });
app.get("/blogs/new",function(req,res){
	res.render("new");
});
app.post("/blogs",function(req,res){
	
	blog.create(req.body.blog ,function(err,newblog){
		if(err)
			res.render("new");
		else {
          res.redirect("/blogs");
      }
		
	});
});

app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id, function(err, blog){
       if(err)
           console.log(err);
       else 
          res.render("show",{blog: blog});
	});			 
});

app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id, function(err, blog){
       if(err)
           console.log(err);
       else 
          res.render("edit",{blog: blog});
	});			
});
	

 app.post("/blogs/:id",function(req,res){
	
     blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err,blog){
	     if(err)
		    res.redirect("/blogs");
	    else
		   res.redirect("/blogs/" + req.params.id);
     });
 
 });


app.post("/blogs/:id/d", function(req, res){
   blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
      }else {
           blog.remove();
           res.redirect("/blogs");
              }
   }); 
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});