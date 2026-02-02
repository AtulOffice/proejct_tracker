import { differenceInCalendarDays, format, isValid } from "date-fns";
import React from "react";

const PhaseProgress = ({ phase }) => {
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


    return (
        <div className="hidden md:block p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner relative">
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
