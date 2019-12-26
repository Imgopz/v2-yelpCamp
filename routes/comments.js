var express 	 = require("express"),
	router 		 = express.Router({mergeParams: true}),
	Campground   = require("../models/campground"),
	Comment      = require("../models/comment");

// show page to create new route
router.get("/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		}else{
			console.log(campground);
			res.render("comments/new", {campground: campground});		
		}
	})
});

// post request to create new comment
router.post("/", isLoggedIn, function(req, res){
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

// isLoggedIn is a ud middleware function to keep the session up and running till user press logout
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router