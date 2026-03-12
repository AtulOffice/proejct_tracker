import mongoose from "mongoose";
import EngineerReocord from "../models/engineers.model.js";
import { ConnDB } from "../db.js";


await ConnDB({ str: "mongodb://localhost:27017/Projec_Tracker" });

const updateOldProgressDates = async () => {

    try {

        const engineers = await EngineerReocord.find();

        for (const eng of engineers) {

            // DOCUMENTS
            eng.developmentProjectList.documents.forEach(project => {
                project.phases.forEach(phase => {
                    phase.lastProgressUpdate = new Date();
                });
            });

            // LOGIC
            eng.developmentProjectList.logic.forEach(project => {
                project.phases.forEach(phase => {
                    phase.lastProgressUpdate = new Date();
                });
            });

            // SCADA
            eng.developmentProjectList.scada.forEach(project => {
                project.phases.forEach(phase => {
                    phase.lastProgressUpdate = new Date();
                });
            });

            // TESTING
            eng.developmentProjectList.testing.forEach(project => {
                project.phases.forEach(phase => {
                    phase.lastProgressUpdate = new Date();
                });
            });

            await eng.save();
        }

        console.log("All old phases updated with current timestamp");

    } catch (error) {

        console.error("Error updating phases:", error);

    } finally {

        mongoose.connection.close();

    }

};

const updateOldProgressDatesRemove = async () => {
    try {

        const engineers = await EngineerReocord.find();

        for (const eng of engineers) {

            const categories = ["documents", "logic", "scada", "testing"];

            categories.forEach(category => {

                eng.developmentProjectList[category].forEach(project => {

                    project.phases.forEach(phase => {
                        if (phase.CompletionPercentage === 0) {
                            phase.lastProgressUpdate = undefined;
                        }
                    });

                });

            });
            await eng.save();
        }

        console.log("lastProgressUpdate removed where CompletionPercentage is 0");

    } catch (error) {
        console.error("Error updating phases:", error);
    }
};

// await updateOldProgressDates();
// await updateOldProgressDatesRemove();