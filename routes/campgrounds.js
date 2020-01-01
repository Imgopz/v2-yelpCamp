var express 	 = require("express"),
	router 		 = express.Router({mergeParams: true}),
	Campground   = require("../models/campground"),
	middleware   = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res){
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
			req.flash("success", "You have createad a campground!")
			res.redirect("/campgrounds");		
		}
	});
	//console.log(campgrounds);
	
});

//Show form to create new CG
router.get("/new", middleware.isLoggedIn, function(req, res){
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

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
	})
})

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds")
		}else{
			req.flash("success", "Campground has been updated successfully!")
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
})

// DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds")
		}else{
			req.flash("success", "Campground has been deleted successfully!")
			res.redirect("/campgrounds")
		}
	})
});

module.exports = router