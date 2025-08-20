// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const studentRoutes = require('./routes/studentRoutes');
const student2Routes = require('./routes/student2Routes');

const app = express();
const PORT = 3500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/students_2', student2Routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
 