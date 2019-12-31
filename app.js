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

var commentroutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Linking css directory to the mail app
app.use(express.static(__dirname + "/public"));
// seedDB(); //seed the database

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


// binding user details in every single route using below middleware function
// it should come after passport serializer and desreializer
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentroutes); 
//router = express.Router({mergeParams: true}) needs to be defined the modules file

app.listen(3000, function(){
	console.log("YelpCamp has been started and running on port 3000..!");
});
