let express = require("express"); // create the server 
let morgan = require("morgan"); // log events
let uuid = require("uuid");

// required for the post 
let bodyParser = require("body-parser"); 
let jsonParser = bodyParser.json();

let app =  express();

//Specify the use of an html where to find it
app.use(express.static("public"));

app.use(morgan("dev"));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Extracted from config file and model.js 
let mongoose = require("mongoose");
let {DATABASE_URL, PORT} = require('./config');
let {PostMethods} = require("./blog-post-model");

mongoose.Promise = global.Promise;

/*
const post = [
	{
		id: uuid.v4(),
		title: "Title1",
		content: "Content1",
		author: "Author1",
		publishedDate: "27-Oct-2019"
	},{
		id: uuid.v4(),
		title: "Title2",
		content: "Content2",
		author: "Author2",
		publishedDate: "27-Oct-2019"
	},{
		id: uuid.v4(),
		title: "Title3",
		content: "Content3",
		author: "Author3",
		publishedDate: "27-Oct-2019"
	}
]
*/

//Start the server requests
/*
app.get("/blog-posts", (req,res,next) => {
	// Check if there are params 
	console.log(req.query);

	if(!(req.query.author)){

		return res.status(200).json({
			content: post,
			message: "All posts in Database"
		});
	}

	if(req.query.author == ""){
		return res.status(406).json("Missing author param");
	}

	post.forEach(function(postObject){
		if(postObject.author == req.query.author){
			return res.status(200).json({
				content: postObject,
				message: "Author Found"
				});
		}
	});

	return res.status(404).json("Author Not Found");

});

*/
app.get("/blog-posts", (req,res,next) => {
	PostMethods.get()
		.then( post => {
			return res.status(200).json(post);
		})
		.catch(err =>{
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			});
		});
});


/*
app.post("/blog-posts", jsonParser , (req,res,next) =>{
	// body with all fields except id 
	console.log(req.body);
	if(!req.body.title || !req.body.content ||
		!req.body.author || !req.body.publishedDate){
		return res.status(406).json({
			code: 406 ,
			message: "parameter missed"
		});
	}
	//Create object with data 
	let postObject = {
		id: uuid.v4(),
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishedDate: req.body.publishedDate
	}
	// Push Object to list 
	post.push(postObject);

	//
	return res.status(201).json({
			code: 201,
			content: postObject,
			message: "Successful Data Posted "
	});


});
*/
app.post("/blog-posts", jsonParser , (req,res,next) =>{
	if(!req.body.title || !req.body.content ||
		!req.body.author || !req.body.publishedDate){
		return res.status(406).json({
			code: 406 ,
			message: "parameter missed"
		});
	}
	//Create object with data 
	let postObject = {
		id: uuid.v4(),
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishedDate: req.body.publishedDate
	}
	console.log("PASE AQUI");
	// Post the data 
	PostMethods.post(postObject)
		.then(post => {
			console.log("SIIII");
			return res.status(201).json({
				code: 201,
				content: post,
				message: "Successful Data Posted "
			});
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			});
		})
});

/*
app.delete("/blog-posts/:id", (req, res , next) => {
	console.log(req.params.id);
	console.log(post);
	let i = 0;
	post.forEach(function(postObject){
		if(postObject.id == req.params.id){
			post.splice(i,1); 
			return res.status(200).json({
				content: postObject,
				message: "Object Deleted"
			});
		}
		i++;
	});
	return res.status(404).json({message: "ID doesn't exist"});
});
*/
app.delete("/blog-posts/:id", (req, res , next) => {
	PostMethods.delete(req.params.id)
		.then(post => {
			return res.status(200).json({
				content: post,
				message: "Object Deleted"
			});
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			});
		});
});


/*
app.put("/blog-posts/:id", jsonParser , (req, res , next) => {
	console.log(req.params.id);
	console.log(post);
	console.log(req.body.id);
	if(!req.body.id){
		return res.status(406).json({message: "ID missed in body"});
	}

	if(req.body.id != req.params.id){
		return res.status(409).json({message: "ID's doesn't match"});
	}
	post.forEach(function(postObject){
		if(postObject.id == req.params.id){
			//Update what the object contains
			if(req.body.title){
				postObject.title = req.body.title;
			}
			if(req.body.content){
				postObject.content = req.body.content;
			}
			if(req.body.author){
				postObject.author = req.body.author;
			}
			if(req.body.publishedDate){
				postObject.publishedDate = req.body.publishedDate;
			}
			return res.status(202).json({
				content: postObject,
				message: "Object Updated"
			});
		}
	});
	return res.status(404).json({message: "ID not Found"});
});

*/

app.put("/blog-posts/:id", jsonParser , (req, res , next) => { 
	if(!req.body.id){
		return res.status(406).json({message: "ID missed in body"});
	}

	if(req.body.id != req.params.id){
		return res.status(409).json({message: "ID's doesn't match"});
	}

	PostMethods.put(req.body)
		.then( post => {
			//Update what the object contains
			if(req.body.title){
				post.title = req.body.title;
			}
			if(req.body.content){
				post.content = req.body.content;
			}
			if(req.body.author){
				post.author = req.body.author;
			}
			if(req.body.publishedDate){
				post.publishedDate = req.body.publishedDate;
			}
			return res.status(202).json({
				content: postObject,
				message: "Object Updated"
			});
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			});
		});

});



/*)
app.listen("8080", () => {
	console.log("App running on localhost:8080"); 
});
*/
let server; 

//At the end 
function runServer(port, databaseUrl){
 return new Promise( (resolve, reject ) => {
	 mongoose.connect(databaseUrl, response => {
		 if ( response ){
		 	return reject(response);
		 }
		 else{
		 	server = app.listen(port, () => {
		 	console.log( "App is running on port " + port );
		 	resolve();
		 })
		 .on( 'error', err => {
		 	mongoose.disconnect();
		 	return reject(err);
		 })
		 }
	 });
 });
}

function closeServer(){
 return mongoose.disconnect()
	 .then(() => {
		 return new Promise((resolve, reject) => {
			 console.log('Closing the server');
			 server.close( err => {
				 if (err){
				 	return reject(err);
				 }
				 else{
				 	resolve();
				 }
			 });
		 });
	 });
}

runServer( PORT, DATABASE_URL )
//runServer( 8181, "mongodb://localhost/postDB" )
 .catch( err => {
 	console.log( err );
 });

module.exports = { app, runServer, closeServer };