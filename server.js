const express = require('express');
const app = express();
const port = 2000;
const cors = require('cors');
app.use(cors()); // Allow all origins

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/cred', require('./routes/cred'));
// Sample route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AuthGo Backend!' });
});

// Start the server
module.exports = app
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});