// routes/auth.js
const express = require("express");
const router = express.Router();
const { supabase } = require("../lib/supabase");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return res.status(400).json({ error: "All fields required" });

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw new Error(authError.message);

    const userId = authData.user.id;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([{ id: userId, username, email }])
      .select();

    if (userError) throw new Error(userError.message);

    res.json({
      message: "Signup successful",
      user: userData[0],
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) throw new Error("Invalid credentials");

    const userId = authData.user.id;

    // Fetch the current user's record from 'users' table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single(); // get single row

    if (userError) throw new Error("Profile not found");

    console.log("Fetched user:", userData);

    res.json({
      message: "Login successful",
      user: userData,
      token: authData.session?.access_token || null,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
