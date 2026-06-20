const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://vriddhilab.vercel.app',
];

const frontendUrls = process.env.FRONTEND_URL;
if (frontendUrls) {
  frontendUrls.split(',').forEach(url => {
    const trimmed = url.trim();
    if (trimmed) allowedOrigins.push(trimmed);
  });
}

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps, curl, postman, or server-to-server)
      if (!origin) {
        return cb(null, true);
      }
      
      // Check if origin is explicitly allowed
      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      
      // Allow Vercel preview deployments matching *.vercel.app
      if (origin.endsWith('.vercel.app')) {
        return cb(null, true);
      }
      
      cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for booking endpoint: max 10 per IP per hour
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many booking requests from this IP. Please try again after 1 hour.',
  },
});

app.use('/api/tests', require('./src/routes/testRoutes'));
app.use('/api/packages', require('./src/routes/packageRoutes'));
app.use('/api/bookings', bookingLimiter, require('./src/routes/bookingRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/offers', require('./src/routes/offerRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', service: 'Vriddhi Pathology API', timestamp: new Date() })
);

app.use(errorHandler);

module.exports = app;
