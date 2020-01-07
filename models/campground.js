var	mongoose   = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: String,
	description: String,
	// created_at: {type: Date, default: Date.now},
	// updated_at: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments:[{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}]
});

campgroundSchema.set('timestamps', true);

module.exports = mongoose.model("Campground", campgroundSchema);