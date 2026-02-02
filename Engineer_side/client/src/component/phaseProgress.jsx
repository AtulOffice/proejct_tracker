import { differenceInCalendarDays } from "date-fns";

const PhaseProgress = ({ phase }) => {
    console.log(phase);
    return;
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    const today = new Date();

    const totalDays = Math.max(1, differenceInCalendarDays(end, start) + 1);
    const daysPassed = Math.min(
        totalDays,
        Math.max(0, differenceInCalendarDays(today, start) + 1)
    );

    const expectedPercent = Math.round((daysPassed / totalDays) * 100);
    const actualPercent = phase.lastCompletionPercent || 0;

    const totalBoxes = totalDays; // Dynamic based on phase length
    const filledBoxes = Math.round((actualPercent / 100) * totalBoxes);

    return (
        <div className="hidden md:block p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
            <label className="mb-4 block text-base font-bold uppercase tracking-wide text-emerald-700">
                Target Progress (Day)
            </label>

            <div className="inline-flex rounded-xl border-2 border-emerald-300 bg-white/80 backdrop-blur-sm px-4 py-4 shadow-lg">
                <div className="flex items-center gap-2 text-xs flex-wrap">
                    {Array.from({ length: totalBoxes }).map((_, i) => {
                        const isFilled = i < filledBoxes;
                        const isToday = i === daysPassed - 1;

                        return (
                            <div
                                key={i}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black shadow-md transition-transform cursor-pointer
                  ${isFilled
                                        ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white"
                                        : "bg-gray-200 text-gray-500"}
                  ${isToday ? "ring-2 ring-yellow-400 scale-110" : ""}
                `}
                                title={`Day ${i + 1}`}
                            >
                                {i + 1}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Percent scale */}
            <div className="mt-3 flex gap-2 text-xs font-semibold text-emerald-700 flex-wrap">
                {Array.from({ length: totalBoxes }).map((_, i) => (
                    <div key={i} className="w-8 text-center">
                        {Math.round(((i + 1) / totalBoxes) * 100)}%
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-4 text-sm font-semibold text-emerald-800">
                Expected by today: {expectedPercent}%
                <br />
                Actual progress: {actualPercent}%
            </div>
        </div>
    );
};

export default PhaseProgress;
