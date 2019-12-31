var express 	 = require("express"),
	router 		 = express.Router({mergeParams: true}),
	Campground   = require("../models/campground");

//Show all CGs
router.get("/", function(req, res){	
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});		
		}
	})
});

// Create - add new CG to db
router.post("/", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: description, author: author};
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
router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});
		
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground)
			res.render("campgrounds/show", {campground: foundCampground});		
		}
	});
	
})

// isLoggedIn is a ud middleware function to keep the session up and running till user press logout
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = router