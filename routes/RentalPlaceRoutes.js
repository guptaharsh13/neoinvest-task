const express = require("express");

const {
  add,
  search,
  findById,
} = require("../controllers/RentalPlaceController");

const authenticateToken = require("../middleware/authentication");

const router = express.Router();

router.route("/add").post(authenticateToken, add);
router.route("/search").get(search);
router.route("/:id").get(findById);

module.exports = router;
