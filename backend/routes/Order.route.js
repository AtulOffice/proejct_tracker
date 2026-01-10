import express from "express";
import {
  updateOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getAllOrdersnew,
  cancelOrderAndProject,
  restoreOrderAndProject,
} from "../controller/order.Controller.js";
import { authenticate } from "../middlware/authaticate.js";

export const OrderRouter = express.Router();

OrderRouter.post("/save", authenticate, createOrder);
OrderRouter.get("/getAll", getAllOrders);
OrderRouter.get("/getAllnew", getAllOrdersnew);
OrderRouter.get("/fetchbyid/:id", getOrderById);
OrderRouter.put("/update/:id", authenticate, updateOrder);
OrderRouter.put("/cancel/:orderId", authenticate, cancelOrderAndProject);
OrderRouter.put("/restore/:orderId", authenticate, restoreOrderAndProject);
