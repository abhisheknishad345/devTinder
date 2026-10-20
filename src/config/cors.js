const allowedOrigins = [
  "https://devloper-tinder.vercel.app",
  "http://localhost:5173", // your Vite dev port
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = { allowedOrigins, corsOptions };