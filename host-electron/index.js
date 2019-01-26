process.env.ELECTRON_ENV = "production";

// Add the express service to electron
require("service");

// Start the electron app
require("./out");
