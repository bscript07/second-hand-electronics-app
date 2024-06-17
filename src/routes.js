const router = require("express").Router();

const homeController = require("./controllers/homeController");
const authController = require("./controllers/authController");
const electronicsController = require("./controllers/electronicsController");

router.use("/", homeController);
router.use("/auth", authController);
router.use("/electronics", electronicsController);

router.all("*", (req, res) => {
    res.render("404");
});

module.exports = router;