var express      = require("express"),
	app		     = express(),
	bodyParser   = require("body-parser"),
	mongoose     = require("mongoose"),
	passport     = require("passport"),
	LocalStrategy = require("passport-local"),
	Campground   = require("./models/campground"),
	Comment      = require("./models/comment"),
	User         = require("./models/user"),
	seedDB 	     = require("./seeds");


mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Linking css directory to the mail app
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "He and She made a good pair",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
	res.render("landing");
});


//Show all CGs

app.get("/campgrounds", function(req, res){	
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});		
		}
	})
});

// Create - add new CG to db
app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name: name, image: image, description: description};
	// Save
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");		
		}
	});
	//console.log(campgrounds);
	
});

//Show form to create new CG
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});
		
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground)
			res.render("campgrounds/show", {campground: foundCampground});		
		}
	});
	
})

//Comments route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		}else{
			console.log(campground);
			res.render("comments/new", {campground: campground});		
		}
	})
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			})
		}
	});
});

//===========
//AUTH ROUTES
//===========
app.get("/register", function(req, res){
	res.render("register");
});

//This route will handle sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		})
	})
});

//Show login
app.get("/login", function(req, res){
	res.render("login");
});

//this route will take care of login logic
//app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),function(req, res){
})

//logout route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
})

// isLoggedIn is a ud middleware function to keep the session up and running till user press logout
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
app.listen(3000, function(){
	console.log("YelpCamp has been started and running on port 3000..!");
});
