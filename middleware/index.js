var Campground   = require("../models/campground"),
    Comment      = require("../models/comment")
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back")
			}else{
				//does user owns the campground
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back")
			}else{
				//does user owns the campground
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
// isLoggedIn is a ud middleware function to keep the session up and running till user press logout
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = middlewareObj