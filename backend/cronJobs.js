import cron from "node-cron";
import workStatusModel from "./models/WorkStatus.model.js";

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
