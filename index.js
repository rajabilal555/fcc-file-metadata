var express = require("express");
var cors = require("cors");
const multer = require("multer");
require("dotenv").config();

var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads");
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now());
	},
});

var upload = multer({ storage: storage });

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), function (req, res) {
	try {
		if (!req.file) {
			res.status(400).json({
				error: true,
				message: "No file uploaded",
			});
		} else {
			let upfile = req.file;

			//send response
			res.json({
				name: upfile.originalname,
				type: upfile.mimetype,
				size: upfile.size,
			});
		}
	} catch (err) {
		res.status(500).json({ error: err });
	}
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Your app is listening on port " + port);
});
