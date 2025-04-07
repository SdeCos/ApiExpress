(function () {
  "use strict";

  function fixture() {
    console.log("Fixture function called");
    // Add your fixture logic here
  }

  module.exports = {
    fixture,
    users: require("./users.json"),
    newUser: require("./new-user.json"),
    createdUser: require("./created-user.json"),
    modifiedUser: require("./modified-user.json"),
  };
})();
