import cron from "node-cron";
import EngineerRecord from "../models/engineers.model.js";
import { sendMail } from "../utils/mailer.js";
import { ActionReminderHtml, progressReminderHtml, upCommingReminderHtml } from "../utils/emailTemplates.js";

export const startPhaseReminderCron = async () => {

    cron.schedule("0 9 * * *", async () => {

        try {
            console.log("Running phase reminder cron...");
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const twoDaysAgo = new Date(today);
            twoDaysAgo.setDate(today.getDate() - 2);

            const engineers = await EngineerRecord.find()
                // .populate("developmentProjectList.documents.project")
                .populate("developmentProjectList.logic.project")
                .populate("developmentProjectList.scada.project");
            // .populate("developmentProjectList.testing.project");

            for (const eng of engineers) {

                const sections = [

                    // ...eng.developmentProjectList.documents.map(p => ({
                    //   type: "Documents",
                    //   block: p
                    // })),

                    ...eng.developmentProjectList.logic.map(p => ({
                        type: "Logic",
                        block: p
                    })),

                    ...eng.developmentProjectList.scada.map(p => ({
                        type: "SCADA",
                        block: p
                    })),

                    // ...eng.developmentProjectList.testing.map(p => ({
                    //   type: "Testing",
                    //   block: p
                    // })),
                ];

                for (const section of sections) {

                    const projectBlock = section.block;
                    const sectionType = section.type;
                    const project = projectBlock.project;

                    for (const phase of projectBlock.phases || []) {

                        if (!phase.startDate || !phase.endDate) continue;

                        const start = new Date(phase.startDate);
                        start.setHours(0, 0, 0, 0);

                        const diffDays = Math.ceil(
                            (start - today) / (1000 * 60 * 60 * 24)
                        );

                        if (diffDays === 2) {

                            await sendMail({
                                // to: eng.email,
                                to: "atul.patel@energyventures.co.in",
                                subject: "Reminder - Upcoming Project",
                                html: upCommingReminderHtml({
                                    engineerName: eng.name,
                                    sectionType,
                                    projectName: project?.projectName,
                                    sectionName: phase.sectionName,
                                    phaseStartDate: phase.startDate,
                                    phaseEndDate: phase.endDate
                                })
                            });

                            console.log("Upcoming Reminder →", eng.name, sectionType, phase.sectionName);

                        }
                        else if (
                            phase.CompletionPercentage > 0 &&
                            phase.CompletionPercentage < 100 &&
                            phase.lastProgressUpdate &&
                            phase.lastProgressUpdate < twoDaysAgo &&
                            today >= start
                        ) {

                            await sendMail({
                                // to: eng.email,
                                to: "atul.patel@energyventures.co.in",
                                subject: "Alert - Progress Update Pending",
                                html: progressReminderHtml({
                                    engineerName: eng.name,
                                    sectionType,
                                    projectName: project?.projectName,
                                    sectionName: phase.sectionName,
                                    phaseStartDate: phase.startDate,
                                    phaseEndDate: phase.endDate,
                                    completion: phase.CompletionPercentage
                                })
                            });

                            console.log("Progress Reminder →", eng.name, sectionType, phase.sectionName);

                        }

                        else if (
                            !phase.lastProgressUpdate &&
                            phase.CompletionPercentage === 0 &&
                            today >= start
                        ) {

                            await sendMail({
                                // to: eng.email,
                                to: "atul.patel@energyventures.co.in",
                                subject: "Alert - Start Date Exceeded",
                                html: ActionReminderHtml({
                                    engineerName: eng.name,
                                    sectionType,
                                    projectName: project?.projectName,
                                    sectionName: phase.sectionName,
                                    phaseStartDate: phase.startDate,
                                    phaseEndDate: phase.endDate
                                })
                            });
                            console.log("No Action Reminder →", eng.name, sectionType, phase.sectionName);
                        }

                    }

                }

            }

        } catch (err) {
            console.error("Phase Reminder Cron Error:", err);
        }

    });

};



