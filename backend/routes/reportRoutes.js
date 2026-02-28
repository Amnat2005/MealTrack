const express = require("express");
const router = express.Router();

const reportController =
  require("../controllers/reportController");

const { verifyToken } =
  require("../middleware/authMiddleware");


router.get(
  "/7days",
  verifyToken,
  reportController.get7DaysReport
);

router.get(
  "/range",
  verifyToken,
  reportController.getReportRange
);

module.exports = router;