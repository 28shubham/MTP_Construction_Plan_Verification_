const router = require("express").Router();
const ensureAuthenticated = require("../Middlewares/Auth.js");
router.get("/", ensureAuthenticated ,(req, res) => {
  console.log('-------loggrd in user detail-------',req.user);
  res.status(200).json([
    { name: "mobile", price: 10000 },
    { name: "laptop", price: 100000 },
    { name: "desktop", price: 20000 },
  ]);
});
// // POST route for adding a new product
// router.post("/", ensureAuthenticated, (req, res) => {
//   const newProduct = req.body;
  
//   // Example: Process the new product (e.g., save it to a database)
//   console.log("New product received:", newProduct);
  
//   // Send response confirming the product was added
//   res.status(201).json({ message: "Product added successfully", product: newProduct });
// });
// Route for user signup with validation middleware

module.exports = router;
