import pool from "../config/database.js";

// Endpoint to handle subscription
export const promotion = (async (req, res) => {

console.log("promotion Req: "+req.body);
  const { email , customerId } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {

    // Insert into the promotions table
    await pool.query(
      `INSERT INTO promotions (email, customer_id) VALUES ($1, $2)`,
      [email, customerId]
    );

    res.status(200).json({ message: 'Subscription successful', customerId });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Duplicate key error
      return res.status(409).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});