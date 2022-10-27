// modules
const express = require("express")
const fs = require("fs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const application = express()

// Config
const PORT = process.env.PORT || 6923

// mongo 

mongoose.connect(`mongodb+srv://ProjectAlo:ProjectAlo@cluster0.pybr4.mongodb.net/AloDataBase?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to db")
}).catch((err) => {
	console.log(err);
})
global.clientTokens = [] // not going to keep this method ig

fs.readdir("./main/workers", (err, files) => {
	files.filter(function(mainFiles) {
		if (!mainFiles.endsWith(".js")) {
			console.log(mainFiles, "must end with .js")
		} else {
			try {
				require(`./main/workers/${mainFiles}`)(application)
				console.log(mainFiles, "has loaded successfuly")
			} catch (err) {
				console.log("failed to load", mainFiles, "-", err)
			}
		}
	})
})

try {
	require(`./main/shop/shop.js`)(application)
	console.log("shop has loaded successfuly")
} catch (err) {
	console.log("failed to load Shop", "-", err)
}
// only for debuging!
application.use((req, res, next) => {
	console.log(`req: ${req.url}`);
	next();
});

//https://discord.com/api/webhooks/1005854469159931987/Q1s6ytUtI9rLhzsyuAGURVLMvVfjBw5um3SW7IYF2_tkcksgK9hhslYn9qLrrdv7VUzU


//application.use(logResponseBody);


application.get("/mp/:what", (req, res) => fs.readFile("./launcher/json/" + req.params.what + ".json", 'utf8', (err, data) => {

	res.setHeader("Content-Type", "text/html");
	if (err) {
		console.log(err)
		res.json({})
	} else {
		res.send(data)
	}
}))

application.listen(PORT, () => console.log(`Server is hosting on port:`, PORT))
application.use(bodyParser.urlencoded({ extended: false }))
application.use(bodyParser.json())
application.get("/", (req, res) => res.redirect("https://www.project-alo.ml"))

// lazy.exe
require("./launcher/login/displayName.js")(application)
require("./launcher/login/check.js")(application)
require("./launcher/login/login.js")(application)
require("./launcher/login/id.js")(application)
require("./launcher/update/vbucks.js")(application)