// import cron from "node-cron";
// import { Recordsform } from "./models/record.model.js";

// export const setupCronJobs = () => {
//   cron.schedule("0 0 * * *", async () => {
//     try {
//       const result = await Recordsform.deleteMany({});
//       console.log(`⏰ Deleted ${result.deletedCount} records.`);
//     } catch (err) {
//       console.error("❌ Cron Job Error:", err);
//     }
//   });
// };
