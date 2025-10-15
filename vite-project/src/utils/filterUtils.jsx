export const  filterProjectsUtils = ({ data, timeFilter, workBool = false }) => {
  return data.filter((project) => {
    const projectDate = new Date(
      workBool ? project.createdAt : project.createdAt
    );
    const currentDate = new Date();

    if (timeFilter === "all") return data;

    if (timeFilter === "today") {
      return data && projectDate.toDateString() === currentDate.toDateString();
    }

    if (timeFilter === "thisWeek") {
      const weekAgo = new Date();
      weekAgo.setDate(currentDate.getDate() - 7);
      return data && projectDate >= weekAgo;
    }

    if (timeFilter === "thisMonth") {
      const monthAgo = new Date();
      monthAgo.setMonth(currentDate.getMonth() - 1);
      return data && projectDate >= monthAgo;
    }

    if (timeFilter === "thisYear") {
      const projectYear = projectDate.getFullYear();
      const currentYear = currentDate.getFullYear();
      return data && projectYear === currentYear;
    }

    return data;
  });
};
