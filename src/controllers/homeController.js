const router = require("express").Router();
const Electronics = require("../models/Electronics");

router.get("/", (req, res) => { 
    res.render("home");
});
router.get("/search", async (req, res) => {
    const name = req.query.name || "";
    const electronics = await Electronics.find({ name: { $regex: name, $options: "i" },}).lean();

    res.render("search", { electronics });
});


module.exports = router;