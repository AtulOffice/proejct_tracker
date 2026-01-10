import express from "express";
import {
    createMarketingMember,
    getAllMarketingMembers,
    getMarketingMemberById,
    updateMarketingMember,
    deleteMarketingMember,
    assignCampaign,
} from "../controller/marketingTeam.controller.js";
import { authenticate } from "../middlware/authaticate.js";

export const MarketRouter = express.Router();

MarketRouter.post("/save", authenticate, createMarketingMember);
MarketRouter.get("/getall", getAllMarketingMembers);
MarketRouter.get("/get/:id", getMarketingMemberById);
MarketRouter.put("/:id", authenticate, updateMarketingMember);
MarketRouter.delete("delete/:id", authenticate, deleteMarketingMember);
MarketRouter.post("/:memberId/campaign", authenticate, assignCampaign);
