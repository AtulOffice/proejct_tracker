import mongoose from "mongoose";
import Order from "../models/orderSheet.model.js";
import ProjectModel from "../models/Project.model.js";
import { docsVal } from "../utils/docsDummy.js";
import { sendMail } from "../utils/mailer.js";
import { newOrderCreatedHtml } from "../utils/order.html.js";
import MarketingMemberRecord from "../models/marketing.team.model.js";

export const createOrder = async (req, res) => {
  try {
    const data = req.body;
    if (!data.entityType || !data.soType || !data.jobNumber || !data.client) {
      return res.status(400).json({
        success: false,
        message:
          "Entity Type, SO Type, Job Number, and Client are required for new orders",
      });
    }

    const marketingData = await MarketingMemberRecord.findById(data?.concerningSalesManager);
    await sendMail({
      to: marketingData?.email,
      //   to: req?.user?.email,
      subject: "NEW ORDER",
      html: newOrderCreatedHtml({ ...data, createdBy: req?.user?.email }),
    });
    const totalPercent =
      Number(data.paymentPercent1 || 0) +
      Number(data.paymentPercent2 || 0 + Number(data.retentionPercent || 0));
    if (totalPercent > 100) {
      return res.status(400).json({
        success: false,
        message: "Total payment percentage cannot exceed 100%",
      });
    }

    const { bookingDate, orderDate, deleveryDate } = data;
    // if (
    //   bookingDate &&
    //   orderDate &&
    //   new Date(orderDate) < new Date(bookingDate)
    // ) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Order Date cannot be before Booking Date",
    //   });
    // }
    // if (
    //   orderDate &&
    //   deleveryDate &&
    //   new Date(deleveryDate) < new Date(orderDate)
    // ) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Delivery Date cannot be before Order Date",
    //   });
    // }

    const jobNumberRegex = new RegExp(`^${data.jobNumber}$`, "i");

    const [existing, existingProject] = await Promise.all([
      Order.findOne({ jobNumber: jobNumberRegex }),
      ProjectModel.findOne({ jobNumber: jobNumberRegex }),
    ]);

    if (existing || existingProject) {
      return res.status(400).json({
        success: false,
        message: "Job Number already exists",
      });
    }

    const order = await Order.create(data);




    const project = await ProjectModel.create({
      OrderMongoId: order._id,
      entityType: order.entityType,
      soType: order.soType,
      jobNumber: order.jobNumber,
      client: order.client,
      projectName: order.client,
      endUser: order.endUser || "",
      location: order.site || "",
      billStatus: order.billingStatus || "",
      bill: order.orderValueTotal || "",
      dueBill: order.orderValueTotal || "",
      swname: order.name || "",
      swtechnicalEmail: order.technicalEmail || "",
      swphone: order.phone || "",
      ...docsVal,
    })

    // by pass new Order Notification middle tab
    await Order.findByIdAndUpdate(
      order._id,
      {
        ProjectDetails: project._id,
        isSaveInProject: true,
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during order creation",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  const search = req.query.search?.trim() || "";

  try {
    const filter = {};
    if (search) {
      // filter.jobNumber = { $regex: new RegExp(`^${search}$`, "i") };
      filter.jobNumber = { $regex: search, $options: "i" };
    }
    const orders = await Order.find(filter, {
      _id: 1,
      site: 1,
      client: 1,
      jobNumber: 1,
      entityType: 1,
      soType: 1,
      endUser: 1,
      bookingDate: 1,
      deleveryDate: 1,
      actualDeleveryDate: 1,
      isCancelled: 1,
      createdAt: 1,
      updatedAt: 1,
      concerningSalesManager: 1,
      orderValueTotal: 1,
      poReceived: 1,
      amndReqrd: 1
    })
      .populate({
        path: "concerningSalesManager",
        select: "name email",
      })
      .sort({
        updatedAt: -1,
        createdAt: -1,
      });


    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const getAllOrdersnew = async (req, res) => {
  try {
    const orders = await Order.find(
      { isSaveInProject: false, soType: { $ne: "SUPPLY" } },
      {
        _id: 1,
        site: 1,
        client: 1,
        jobNumber: 1,
        entityType: 1,
        soType: 1,
        bookingDate: 1,
        endUser: 1,
        orderNumber: 1,
        orderDate: 1,
        deleveryDate: 1,
        technicalEmail: 1,
        billingStatus: 1,
        netOrderValue: 1,
        name: 1,
        email: 1,
        phone: 1,
        orderValueSupply: 1,
        orderValueService: 1,
        orderValueTotal: 1,
        poReceived: 1,
        orderNumber: 1,
        orderDate: 1,
        deleveryDate: 1,
        actualDeleveryDate: 1,
        amndReqrd: 1,
        concerningSalesManager: 1,
      }
    ).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Order ID (_id) is required for updating an order",
      });
    }

    const totalPercent =
      Number(data.paymentPercent1 || 0) + Number(data.paymentPercent2 || 0);
    if (totalPercent > 100) {
      return res.status(400).json({
        success: false,
        message: "Total payment percentage cannot exceed 100%",
      });
    }

    const { bookingDate, orderDate, deleveryDate } = data;
    // if (
    //   bookingDate &&
    //   orderDate &&
    //   new Date(orderDate) < new Date(bookingDate)
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Order Date cannot be before Booking Date",
    //   });
    // }
    // if (
    //   orderDate &&
    //   deleveryDate &&
    //   new Date(deleveryDate) < new Date(orderDate)
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Delivery Date cannot be before Order Date",
    //   });
    // }

    const order = await Order.findByIdAndUpdate(_id, data, { new: true });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error in updateOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during order update",
      error: error.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populateManager } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }
    const shouldPopulateManager = populateManager !== "false";

    let query = Order.findById(id).populate({
      path: "ProjectDetails",
      select: "",
    });

    if (shouldPopulateManager) {
      query = query.populate({
        path: "concerningSalesManager",
        select: "name email phone empId",
      });
    }

    const order = await query;

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};



// cancell order

export const cancelOrderAndProject = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (order.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }
    order.isCancelled = true;
    await order.save();
    if (order?.ProjectDetails && mongoose.Types.ObjectId.isValid(order.ProjectDetails)) {
      await ProjectModel.findByIdAndUpdate(
        order.ProjectDetails,
        { isCancelled: true },
        { new: true }
      );
    }
    return res.status(200).json({
      success: true,
      message: "Order and related project cancelled successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// restore project opertaion

export const restoreOrderAndProject = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Order is not cancelled",
      });
    }

    order.isCancelled = false;
    await order.save();

    if (
      order?.ProjectDetails &&
      mongoose.Types.ObjectId.isValid(order.ProjectDetails)
    ) {
      await ProjectModel.findByIdAndUpdate(
        order.ProjectDetails,
        { isCancelled: false },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Order and related project restored successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};



// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (true) {
      return res.status(400).json({
        success: false,
        message: "delete operation is closed by developer temperory",
      });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      order: deletedOrder,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};

// Get orders by status
export const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!["OPEN", "CLOSED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const orders = await Order.find({ status }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};
