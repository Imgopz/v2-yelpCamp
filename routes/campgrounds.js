var express 	 = require("express"),
	router 		 = express.Router(),
	Campground   = require("../models/campground");
//Show all CGs
router.get("/campgrounds", function(req, res){	
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});		
		}
	})
});

// Create - add new CG to db
router.post("/campgrounds", function(req, res){
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
router.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});
		
router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground)
			res.render("campgrounds/show", {campground: foundCampground});		
		}
	});
	
})

module.exports = router