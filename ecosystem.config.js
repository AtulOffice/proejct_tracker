module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./backend",
      script: "cmd",
      args: "/c npm run dev",
    },
    {
      name: "frontend",
      cwd: "./vite-project",
      script: "cmd",
      args: "/c npm run dev -- --host",
    },
  ],
};
