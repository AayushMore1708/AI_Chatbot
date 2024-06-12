require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const BardAPI = require('./src/bardAPI');
const apiKey = process.env.API_KEY;

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const bard = new BardAPI();
bard.initializeChat(apiKey);

app.post('/api/chat', async (req, res) => {
  const { message } = req.body; try {
    const response = await bard.getBardResponse(message);
    const formattedResponse = formatResponse(response);
    res.json(formattedResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});

// Helper function to format response
function formatResponse(response) {
  const { text, codePoints } = response;
  return {
    text,
    codePoints,
    timestamp: new Date().toISOString(),
  };
}