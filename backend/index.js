require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { getOrCreateUser, updateUserRole, getAllUsers } = require('./db/database');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Auth App Backend API is running' });
});

// Auth0 JWT middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

// Middleware to check admin role
const checkAdmin = async (req, res, next) => {
  const userId = req.auth.sub;
  const user = getOrCreateUser(userId);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin role required' });
  }
  next();
};

// API endpoint to get user role
app.get('/api/user/role', checkJwt, (req, res) => {
  const userId = req.auth.sub;
  try {
    const user = getOrCreateUser(userId);
    res.json({ role: user.role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get all users (admin only)
app.get('/api/users', checkJwt, checkAdmin, (req, res) => {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to update user role (admin only)
app.post('/api/user/role', checkJwt, checkAdmin, (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid userId or role' });
  }
  try {
    updateUserRole(userId, role);
    res.json({ message: `Role updated to ${role} for user ${userId}` });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});