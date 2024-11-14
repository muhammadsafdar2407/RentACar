import pool from "../config/database.js";
import io from "../../server.js";

export const createComment = async (req, res) => {
  const user = req.user;
  const { customer_id } = user;
  const { customername } = user;
  const { vehicle_number, comment } = req.body;
  const { rating } = req.body;
  try {
    const res = await pool.query(
      "INSERT INTO review (vehicle_number, customer_id, comment_text,customer_name,rating) VALUES ($1, $2, $3,$4,$5) RETURNING *;",
      [vehicle_number, customer_id, comment, customername, rating]
    );

    const newComment = res.rows[0];
    newComment.customername = customername;
    newComment.rating = rating;
    console.log(newComment);

    io.emit("newComment", newComment);

    return newComment;
  } catch (err) {
    console.error(err);
  }
};

export const notifyUsers = async (req, res) => {
  io.emit("newComment", "Hello");
};

export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM review WHERE vehicle_number = $1 ORDER BY created_at ASC;",
      [id]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
  }
};
