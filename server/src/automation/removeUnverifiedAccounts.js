const User = require("../models/userModel");
const cron = require("node-cron");

const removeUnverifiedAccounts = () => {
  cron.schedule("*/60 * * * *", async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await User.deleteMany({
      accountVerified: false,
      createdAt: { $lt: oneHourAgo },
    });
  });
};

module.exports = removeUnverifiedAccounts;
