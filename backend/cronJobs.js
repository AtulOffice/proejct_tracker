import cron from "node-cron";
import workStatusModel from "./models/WorkStatus.model.js";
import { updateEngineerAssignmentStatusCrons } from "./controller/engineer.controller.js";

export const setupCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await workStatusModel.deleteMany({});
      console.log(`⏰ Deleted ${result.deletedCount} work status.`);
    } catch (err) {
      console.error("❌ Cron Job Error:", err);
    }
  });
};

export const engineerStatus = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      await updateEngineerAssignmentStatusCrons();
      console.log(`⏰ Engineer status updated successfully at 12 AM.`);
    } catch (err) {
      console.error("❌ Cron Job Error:", err);
    }
  });
};
