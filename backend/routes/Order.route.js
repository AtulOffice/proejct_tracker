import express from "express";
import {
  updateOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getAllOrdersnew,
} from "../controller/orderController.js";

export const OrderRouter = express.Router();

OrderRouter.post("/save", createOrder);
OrderRouter.get("/getAll", getAllOrders);
OrderRouter.get("/getAllnew", getAllOrdersnew);
OrderRouter.get("/fetchbyid/:id", getOrderById);
OrderRouter.put("/update/:id", updateOrder);
