const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

router.post("/signup", validInfo, userCtrl.signup);
router.post("/login", validInfo, userCtrl.login);
router.get("/is-verified", authorization, userCtrl.verif);
router.get("/getInfo", authorization, userCtrl.getinfo);
router.post("/deleteUser", authorization, userCtrl.deleteuser);
router.post("/modifyInfo", authorization, validInfo, userCtrl.modifyinfo);

module.exports = router;
