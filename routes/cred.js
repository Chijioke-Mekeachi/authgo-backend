const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// 🟢 Add a new credential
router.post('/add', async (req, res) => {
  try {
    const { id, social, username, password } = req.body;

    if (!id || !social || !username || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { data, error } = await supabase
      .from('credentials')
      .insert([{ id, social, username, password }]);

    if (error) throw error;

    res.json({ message: 'Credential added successfully', data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🟢 Fetch all credentials that belong to a user ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Select all credentials where id matches the given one
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('id', id); // 👈 This filters by user ID

    if (error) throw error;

    res.json({
      message: `Found ${data.length} credentials for user ID ${id}`,
      creds: data,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
