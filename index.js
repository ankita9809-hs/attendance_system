//Global Imports
const express = require("express");
const { createServer } = require("http");
const bodyParser = require("body-parser");

//Local Imports
const { ENV } = require("./src/config/env");
const { STATUSCODE, clientErrorResponse } = require("./src/utils/response");
const { connectDB } = require("./src/config/database");
const { apiRoutes } = require("./src/apiRoutes/routes");

const app = express();
app.use(bodyParser.json());
const server = createServer(app);
const port = ENV.API_PORT;

//API Routes
apiRoutes(app);

//API Not Found
app.use("*", (req, res) =>
  clientErrorResponse(res, "API Not Found!", STATUSCODE.NOTFOUND)
);

//Express configuration
server.listen(port, async () => {
  console.log("Server is running on", port);
  await connectDB();
});
