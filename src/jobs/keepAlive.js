const cron = require("node-cron");

const startKeepAlive = () => {
  // Render sets RENDER_EXTERNAL_URL automatically. Fall back to your own env var.
  const url = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;

  if (!url) {
    console.log("Keep-alive skipped: no public URL set (probably running locally).");
    return;
  }

  // Every 14 minutes (Render sleeps after 15 minutes of no inbound traffic)
  cron.schedule("0 */2 * * *", async () => {
    try {
      const res = await fetch(`${url}/health`); // built-in fetch, Node 18+
      console.log(`Keep-alive ping: ${res.status} at ${new Date().toISOString()}`);
    } catch (err) {
      console.error("Keep-alive ping failed:", err.message);
    }
  });

  console.log("Keep-alive cron started");
};

module.exports = startKeepAlive;