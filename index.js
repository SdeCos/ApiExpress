const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001; // Changed port to 3001

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/pages"));

// MongoDB connection
const mongoURI =
  "mongodb://saul:1234@localhost:27018/apiExpress?authSource=admin";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/viewData", async (req, res) => {
  const conn = mongoose.connection;
  const collections = await conn.db.listCollections().toArray();
  const collectionNames = collections.map((col) => col.name);
  const collectionName = req.query.collection || collectionNames[0];

  try {
    const data = await conn.db.collection(collectionName).find().toArray();
    res.render("viewData", { data, collections: collectionNames });
  } catch (err) {
    res.status(400).send("Unable to fetch data from database");
  }
});

app.get("/addData", (req, res) => {
  res.render("addData");
});

app.post("/addData", (req, res) => {
  const { name, email } = req.body;
  const newData = new mongoose.models.User({ name, email });

  newData
    .save()
    .then(() => res.redirect("/viewData"))
    .catch((err) => {
      console.error("Error saving to database:", err);
      res.status(400).send("Unable to save to database");
    });
});

app.get("/deleteData", (req, res) => {
  res.render("deleteData");
});

app.post("/deleteData", (req, res) => {
  const { id } = req.body;

  mongoose.models.User.findByIdAndRemove(id)
    .then(() => res.redirect("/viewData"))
    .catch((err) => {
      console.error("Error deleting from database:", err);
      res.status(400).send("Unable to delete data from database");
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
