module.exports = {
  apps: [
    {
      name: "auxinz-backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        DB_HOST: "127.0.0.1",
        DB_PORT: 3306,
        DB_USER: "root",
        DB_PASS: "DevTeam123",
        DB_NAME: "auxinz",
      },
    },
  ],
};
