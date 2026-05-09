const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for logs (in production, use a database)
let logs = [];

// Endpoint to receive logs
app.post('/logs', (req, res) => {
  try {
    const { stack, level, package: pkg, message } = req.body;

    const logEntry = {
      id: Date.now(),
      timestamp: new Date(),
      stack,
      level,
      package: pkg,
      message
    };

    logs.push(logEntry);

    console.log(`[${level.toUpperCase()}] ${stack} - ${pkg}: ${message}`);

    res.status(200).json({
      success: true,
      message: 'Log received successfully',
      logId: logEntry.id
    });
  } catch (error) {
    console.error('Error processing log:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing log'
    });
  }
});

// Endpoint to get all logs
app.get('/logs', (req, res) => {
  res.json({
    success: true,
    logs: logs
  });
});

// Endpoint to get logs by level
app.get('/logs/:level', (req, res) => {
  const { level } = req.params;
  const filteredLogs = logs.filter(log => log.level === level);
  res.json({
    success: true,
    logs: filteredLogs
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date(),
    logCount: logs.length
  });
});

// Notification endpoint (placeholder for notification system)
app.post('/notifications', (req, res) => {
  try {
    const { title, message } = req.body;

    // Here you would integrate with actual notification service
    // For now, just log it
    console.log(`Notification: ${title} - ${message}`);

    res.status(200).json({
      success: true,
      message: 'Notification processed'
    });
  } catch (error) {
    console.error('Error processing notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing notification'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});