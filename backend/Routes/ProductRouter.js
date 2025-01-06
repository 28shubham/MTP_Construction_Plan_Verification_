const router = require("express").Router();
const ensureAuthenticated = require("../Middlewares/Auth.js");
router.get("/", ensureAuthenticated, (req, res) => {
  console.log("-------loggrd in user detail-------", req.user);
  res.status(200).json([
    { name: "mobile", price: 10000 },
    { name: "laptop", price: 100000 },
    { name: "desktop", price: 20000 },
  ]);
});

module.exports = router;
