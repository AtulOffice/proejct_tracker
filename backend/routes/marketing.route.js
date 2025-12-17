import express from "express";
import {
    createMarketingMember,
    getAllMarketingMembers,
    getMarketingMemberById,
    updateMarketingMember,
    deleteMarketingMember,
    assignCampaign,
} from "../controller/marketingTeam.controller.js";

export const MarketRouter = express.Router();

MarketRouter.post("/save", createMarketingMember);
MarketRouter.get("/getall", getAllMarketingMembers);
MarketRouter.get("/get/:id", getMarketingMemberById);
MarketRouter.put("/:id", updateMarketingMember);
MarketRouter.delete("delete/:id", deleteMarketingMember);
MarketRouter.post("/:memberId/campaign", assignCampaign);
