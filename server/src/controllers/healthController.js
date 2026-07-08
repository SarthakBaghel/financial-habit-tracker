export function getHealth(_req, res) {
  res.status(200).json({
    status: "ok",
    message: "Wealth Growth Tracker API is healthy",
    service: "financial-habit-builder-api",
    timestamp: new Date().toISOString()
  });
}
