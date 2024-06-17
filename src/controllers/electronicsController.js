const router = require("express").Router();

const { isAuth } = require("../middleware/authMiddleware");
const { getErrorMessage } = require("../utils/errorUtils");
const electronicsService = require('../services/electronicsService');
const Electronics = require("../models/Electronics");

router.get("/", async (req, res) => {
    const electronics = await electronicsService.getAll().lean();

    res.render("electronics/catalog", { electronics });
});

router.get("/:electronicId/details", async (req, res) => {
    const electronicId = req.params.electronicId;
    const userId = req.user?._id;

    const electronic = await electronicsService.getOneDetailed(electronicId, userId);
    const isOwner = electronic.owner && electronic.owner._id.equals(req.user?._id);

    res.render("electronics/details", { ...electronic, isOwner });
});

router.get("/:electronicId/buy-handler", async (req, res) => {
    const electronicId = req.params.electronicId;
    const userId = req.user?._id;

    const electronic = await Electronics.findById(electronicId);

    electronic.buyingList.push(userId);
    await electronic.save();

    res.redirect(`/electronics/${electronicId}/details`);
});

router.get("/create", isAuth, (req, res) => {
    res.render("electronics/create");
});

router.post("/create", isAuth, async (req, res) => {
    const electronicData = req.body;

    try {
        await electronicsService.create(req.user._id, electronicData);

        res.redirect("/electronics");
    } catch (err) {
        res.render("electronics/create", { ...electronicData, error: getErrorMessage(err) });
    }
});

router.get("/:electronicId/edit", isElectronicOwner, async (req, res) => {
    res.render("electronics/edit", { ...req.electronic });
});

router.post("/:electronicId/edit", isElectronicOwner, async (req, res) => {

    const electronicData = req.body;

    try {
        await electronicsService.edit(req.params.electronicId, electronicData);

        res.redirect(`/electronics/${req.params.electronicId}/details`);
    } catch (err) {
        res.render("electronics/edit", { ...electronicData, error: getErrorMessage(err)});
    }
});

router.get("/:electronicId/delete", isElectronicOwner, async (req, res) => {
    
    await electronicsService.delete(req.params.electronicId);

    res.redirect("/electronics");
});

async function isElectronicOwner(req, res, next) {
    const electronic = await electronicsService.getOne(req.params.electronicId).lean();

    if (electronic.owner != req.user?._id) {
        return res.redirect(`/electronics/${req.params.electronicId}/details`);
    }

    req.electronic = electronic;
    next();
} 

module.exports = router;