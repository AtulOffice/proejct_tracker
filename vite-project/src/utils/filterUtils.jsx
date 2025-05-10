export const filterProjectsUtils = ({ data, searchTerm, timeFilter }) => {
  return data.filter((project) => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.jobNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const projectDate = new Date(project.orderDate);
    const currentDate = new Date();

    if (timeFilter === "all") return matchesSearch;

    if (timeFilter === "today") {
      return (
        matchesSearch &&
        projectDate.toDateString() === currentDate.toDateString()
      );
    }

    if (timeFilter === "thisWeek") {
      const weekAgo = new Date();
      weekAgo.setDate(currentDate.getDate() - 7);
      return matchesSearch && projectDate >= weekAgo;
    }

    if (timeFilter === "thisMonth") {
      const monthAgo = new Date();
      monthAgo.setMonth(currentDate.getMonth() - 1);
      return matchesSearch && projectDate >= monthAgo;
    }

    if (timeFilter === "thisYear") {
      const projectYear = projectDate.getFullYear();
      const currentYear = currentDate.getFullYear();
      return matchesSearch && projectYear === currentYear;
    }

    return matchesSearch;
  });
};
