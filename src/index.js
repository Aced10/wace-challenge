const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const app = express();
dotenv.config();

// DB Connection
require("./database");

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/payments-source", require("./routes/payments.routes"));
app.use("/api/rides", require("./routes/rides.routes"));

// Starting the server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});

// Dummy data
const { newUser } = require("./entities/usersEntity");
const { users } = require("./data/dummyData");

users.forEach((user) => {
  newUser(user);
});
