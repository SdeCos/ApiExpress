const mongoose = require("mongoose");

const MongoDBUtil = {
  init: function () {
    mongoose
      .connect(
        "mongodb://saul:1234@localhost:27018/apiExpress?authSource=admin",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      )
      .then(function () {
        console.log("Connected to MongoDB");
      })
      .catch(function (err) {
        console.error("Could not connect to MongoDB:", err);
      });
  },
};

module.exports = MongoDBUtil;
