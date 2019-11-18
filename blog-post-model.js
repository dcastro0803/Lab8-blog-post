// Create the database with queries

let mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
	id : {type: String, required: true},
	title : {type: String, required: true},
	content: {type: String, required: true},
	author : {type: String, required : true},
	publishedDate: {type: String, required: true}
});

// run the DB then the queries 
let Post = mongoose.model("Blog-post", postSchema);

let PostMethods = {
	get: function(){
		return Post.find()
			.then(posts => {
				return posts;
			})
			.catch(err => {
				throw Error( error );
			})
	},
	post: function (newPost){
		return Post.create(newPost)
			.then( post => {
				return post;
			})
			.catch(err => {
				throw Error( error );
			})
	},
	put: function(updatedPost){
		return Post.findOneAndUpdate({id: updatedPost.id}, {$set:{updatedPost}})
			.then( post =>{
				return post;
			})
			.catch(err => {
				throw Error( error );
			})
	},
	delete: function(deletedPost){
		return Post.findOneAndRemove({id: deletedPost})
			.then(post => {
				return post;
			})
			.catch(err => {
				throw Error( error );
			})
	}
}

module.exports = {PostMethods}