const express = require('express');
const cors = require('cors'); // Import cors
const { exec } = require('child_process');
const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.post('/run-command', (req, res) => {
  const { command } = req.body;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      return res.status(500).json({ stderr });
    }
    res.status(200).json({ stdout });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
