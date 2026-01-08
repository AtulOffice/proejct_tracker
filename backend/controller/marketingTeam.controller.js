import MarketingMemberRecord from "../models/marketing.team.model.js";
import bcrypt from "bcryptjs";


export const createMarketingMember = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            empId,
            password,
            designation,
            createdBy,
        } = req.body;

        if (!email || !empId) {
            return res.status(400).json({ success: false, message: "the  email and empId requred" })
        }
        const exists = await MarketingMemberRecord.findOne({
            $or: [{ email }, { empId }],
        });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Email or Employee ID already exists",
            });
        }
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const member = await MarketingMemberRecord.create({
            name,
            email,
            phone,
            empId,
            password: hashedPassword,
            designation,
            createdBy,
        });

        return res.status(201).json({
            success: true,
            message: "Marketing member created successfully",
            data: member,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getAllMarketingMembers = async (req, res) => {
    try {
        const members = await MarketingMemberRecord.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: members,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getMarketingMemberById = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await MarketingMemberRecord.findById(id).populate(
            "createdBy",
            "name email"
        );

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Marketing member not found",
            });
        }

        res.json({
            success: true,
            data: member,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const updateMarketingMember = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await MarketingMemberRecord.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Marketing member not found",
            });
        }

        res.json({
            success: true,
            message: "Marketing member updated successfully",
            data: updated,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const deleteMarketingMember = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await MarketingMemberRecord.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Marketing member not found",
            });
        }

        res.json({
            success: true,
            message: "Marketing member deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const assignCampaign = async (req, res) => {
    try {
        const { memberId } = req.params;
        const campaignData = req.body;

        const member = await MarketingMemberRecord.findById(memberId);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Marketing member not found",
            });
        }

        member.campaigns.push(campaignData);
        member.isAssigned = true;

        await member.save();

        res.json({
            success: true,
            message: "Campaign assigned successfully",
            data: member,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
