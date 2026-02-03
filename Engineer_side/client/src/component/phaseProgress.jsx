import React from "react";
import { differenceInCalendarDays, format, isValid } from "date-fns";



const PhaseProgress = ({ phase }) => {
    console.log(phase)
    const startRaw = phase?.phase?.startDate;
    const endRaw = phase?.phase?.endDate;
    const progressDateRaw = phase?.LastphaseProgress?.createdAt;

    const start = startRaw ? new Date(startRaw) : null;
    const end = endRaw ? new Date(endRaw) : null;
    const progressDate = progressDateRaw ? new Date(progressDateRaw) : null;

    if (!start || !end || !isValid(start) || !isValid(end) || end < start) {
        return null;
    }

    const actualPercent = Math.min(
        100,
        Math.max(0, phase?.LastphaseProgress?.actualCompletionPercent || 0)
    );

    const actualStartRaw = phase?.LastphaseProgress?.actualStartDate;
    const actualStart = actualStartRaw ? new Date(actualStartRaw) : null;

    let daysPassed = "-";
    if (actualStart && isValid(actualStart)) {
        daysPassed = Math.max(
            1,
            differenceInCalendarDays(new Date(), actualStart) + 1
        );
    }

    let progressColor = "from-red-500 to-rose-700";

    if (actualPercent > 30 && actualPercent <= 50) {
        progressColor = "from-orange-400 to-amber-600";
    } else if (actualPercent > 50 && actualPercent <= 70) {
        progressColor = "from-yellow-300 to-yellow-500";
    } else if (actualPercent > 70 && actualPercent < 100) {
        progressColor = "from-sky-400 to-blue-600";
    } else if (actualPercent === 100) {
        progressColor = "from-emerald-400 to-teal-600";
    }

    const plannedColor = "from-blue-300 to-blue-500";

    const today = new Date();

    let plannedPercent = 0;

    if (today < start) {
        plannedPercent = 0;
    } else if (today > end) {
        plannedPercent = 100;
    } else {
        const totalDays = differenceInCalendarDays(end, start) + 1;
        const daysFromStart = differenceInCalendarDays(today, start) + 1;

        plannedPercent = Math.min(
            100,
            Math.max(0, (daysFromStart / totalDays) * 100)
        );
    }



    return (
        <div className="hidden md:block p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-lg">

            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner relative mt-4">
                <div
                    className={`h-full bg-gradient-to-r ${plannedColor} transition-all duration-500 flex items-center justify-between px-3 text-white text-xs font-semibold`}
                    style={{ width: `${plannedPercent}%` }}
                >
                    {plannedPercent > 15 && (
                        <span>{plannedPercent.toFixed(0)}%</span>
                    )}

                    {plannedPercent > 25 && (
                        <span className="whitespace-nowrap text-white/90">
                            {today > end
                                ? format(end, "dd MMM")
                                : format(today, "dd MMM")
                            }
                        </span>
                    )}
                </div>


            </div>

            {/* <div className="flex justify-between text-[11px] font-medium text-slate-700 mt-1 px-1">
                <span>{format(start, "dd MMM")}</span>
                <span>{format(end, "dd MMM")}</span>
            </div> */}

            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner relative mt-3">
                <div
                    className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-500 flex items-center justify-between px-3 text-white text-xs font-bold`}
                    style={{ width: `${actualPercent}%` }}
                >
                    <span>{actualPercent}%</span>

                    {progressDate && isValid(progressDate) && (
                        <span className="whitespace-nowrap">
                            {format(progressDate, "dd MMM")}
                        </span>
                    )}
                </div>
            </div>


            <div className="flex justify-end text-sm font-semibold text-emerald-800 mt-3">
                <span>Today: {daysPassed} days</span>
            </div>
        </div>
    );
};

export default PhaseProgress;
