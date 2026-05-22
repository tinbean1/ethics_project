require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock data for demo mode when no API key is configured
// These are real, documented breaches from HIBP public records
const MOCK_BREACHES = [
  {
    Name: "LinkedIn",
    BreachDate: "2021-06-22",
    DataClasses: ["Email addresses", "Passwords", "Phone numbers"],
    Description: "In 2021, LinkedIn suffered a data scrape affecting approximately 700 million users. The scraped data included email addresses, full names, phone numbers, and physical addresses."
  },
  {
    Name: "Adobe",
    BreachDate: "2013-10-04",
    DataClasses: ["Email addresses", "Passwords", "Password hints"],
    Description: "In October 2013, Adobe exposed 153 million user records including internal ID, username, email, encrypted password, and password hints in plain text."
  },
  {
    Name: "Canva",
    BreachDate: "2019-05-24",
    DataClasses: ["Email addresses", "Names", "Usernames", "Passwords"],
    Description: "In May 2019, the graphic design tool Canva suffered a data breach affecting 137 million users. Data included email addresses, names, usernames, and bcrypt-hashed passwords."
  }
];

/**
 * GET /api/breach/:email
 * Proxies the HaveIBeenPwned API to keep the API key server-side.
 * Falls back to mock data if no API key is configured (demo mode).
 */
app.get('/api/breach/:email', async (req, res) => {
  const { email } = req.params;

  // Basic email format check at the server boundary
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Demo mode: no API key set, return mock data clearly labeled
  if (!process.env.HIBP_API_KEY) {
    return res.json({
      breaches: MOCK_BREACHES,
      mockMode: true,
      mockModeMessage: 'Demo mode — connect HIBP API key for live results'
    });
  }

  try {
    const response = await axios.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`,
      {
        headers: {
          'hibp-api-key': process.env.HIBP_API_KEY,
          'user-agent': 'DataTrace-Ethics-Project'
        },
        params: {
          truncateResponse: false
        }
      }
    );

    return res.json({ breaches: response.data, mockMode: false });
  } catch (error) {
    // HIBP returns 404 when the email has no breaches — that is a success case
    if (error.response && error.response.status === 404) {
      return res.json({ breaches: [], mockMode: false });
    }
    // 401 means bad API key
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ error: 'Invalid HIBP API key. Check your .env file.' });
    }
    // 429 means rate limited
    if (error.response && error.response.status === 429) {
      return res.status(429).json({ error: 'Rate limited by HIBP. Please wait a moment and try again.' });
    }
    console.error('HIBP API error:', error.message);
    return res.status(500).json({ error: 'Failed to reach HaveIBeenPwned API.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mockMode: !process.env.HIBP_API_KEY,
    message: process.env.HIBP_API_KEY ? 'Live HIBP mode active' : 'Demo mode — no API key set'
  });
});

app.listen(PORT, () => {
  console.log(`DataTrace server running on http://localhost:${PORT}`);
  if (!process.env.HIBP_API_KEY) {
    console.log('⚠️  HIBP_API_KEY not set — running in demo/mock mode');
    console.log('   Get a key at: https://haveibeenpwned.com/API/Key');
  } else {
    console.log('✅ HIBP API key loaded — live breach checking active');
  }
});
