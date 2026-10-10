module.exports = {
  apps: [
    {
      name: "boetto-web",
      script: "server.js",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
