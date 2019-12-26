var express 	 = require("express"),
	router 		 = express.Router(),
	passport     = require("passport"),
	User         = require("../models/user");

router.get("/", function(req, res){
	res.render("landing");
});

//===========
//AUTH ROUTES
//===========
router.get("/register", function(req, res){
	res.render("register");
});

//This route will handle sign up logic
router.post("/register", function(req, res){
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
router.get("/login", function(req, res){
	res.render("login");
});

//this route will take care of login logic
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),function(req, res){
})

//logout route
router.get("/logout", function(req, res){
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

module.exports = router