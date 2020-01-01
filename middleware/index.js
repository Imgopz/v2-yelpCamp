var Campground   = require("../models/campground"),
    Comment      = require("../models/comment")
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found!")
				res.redirect("back")
			}else{
				//does user owns the campground
				if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have the permission to do that!")
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that!")
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
				if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have the permission to do that!")
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
// isLoggedIn is a ud middleware function to keep the session up and running till user press logout
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}


module.exports = middlewareObj