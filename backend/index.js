// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const AuthRouter = require("./Routes/AuthRouter");
// require("dotenv").config();
// require("./Models/db");
// const PORT = process.env.PORT || 8080;

// app.get("/ping", (req, res) => {
//   res.send("PONG");
// });

// app.use(bodyParser.json());
// app.use(cors());
// app.use("/auth", AuthRouter);

// const server = app.listen(PORT, () => {
//   console.log(`Server is running on ${PORT}`); // Use backticks for template literals
// });

// server.on("error", (err) => {
//   if (err.code === "EADDRINUSE") {
//     console.error(`Port ${PORT} is already in use.`);
//   } else {
//     console.error("Server error:", err);
//   }
// });

// process.on("SIGTERM", () => {
//   server.close(() => {
//     console.log("Process terminated");
//   });
// });

// process.on("SIGINT", () => {
//   server.close(() => {
//     console.log("Process interrupted");
//   });
// });


// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const AuthRouter = require("./Routes/AuthRouter");
// const ProductRouter = require("./Routes/ProductRouter");
// const VerificationForm = require("./Models/validationForm");
// app.post('/Models/verificationForm',verifyForm);
// require("dotenv").config();
// require("./Models/db");
// const PORT = process.env.PORT || 8080;

// app.get("/ping", (req, res) => {
//   res.send("PONG");
// });
// app.post('/api/verifyForm', verifyForm);
// app.use(bodyParser.json());
// app.use(cors());
// app.use("/auth", AuthRouter);
// app.use("/products", ProductRouter);

// app
//   .listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`); // Use backticks for template literals
//   })
//   .on("error", (err) => {
//     console.error("Server error:", err);
//   });


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");
const { verifyForm } = require("./Controllers/verificationController"); // Adjust path if necessary

require("dotenv").config();
require("./Models/db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

app.get("/ping", (req, res) => {
  res.send("PONG");
});

// Define the route for verification form
app.post('/api/verifyForm', verifyForm);

app.use("/auth", AuthRouter);
app.use("/products", ProductRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
}).on("error", (err) => {
  console.error("Server error:", err);
});

