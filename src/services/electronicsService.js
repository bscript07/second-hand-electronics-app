const Electronics = require("../models/Electronics");
const User = require("../models/User");

exports.getAll = () => Electronics.find();
exports.getOne = (electronicId) => Electronics.findById(electronicId).populate();

exports.getOneDetailed = async (electronicId, userId) => {
    const electronic = await Electronics.findById(electronicId)
    .populate("owner")
    .populate("buyingList")
    .lean();
 
    const isBuy = electronic.buyingList.some(buyer => buyer._id.equals(userId));
    
    return {...electronic, isBuy };
 }

exports.create = async (userId, electronicData) => {
   const createdElectronic = await Electronics.create({
    owner: userId,
    ...electronicData,
   });

   await User.findByIdAndUpdate(userId, { $push: { createdItems: createdElectronic._id}});

   return createdElectronic;
};

exports.delete = (electronicId) => Electronics.findByIdAndDelete(electronicId);
exports.edit = (electronicId, electronicData) => Electronics.findByIdAndUpdate(electronicId, electronicData, { runValidators: true});