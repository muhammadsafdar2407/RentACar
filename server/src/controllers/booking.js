import pool from "../config/database.js";

export const createBooking = async (req, res) => {
  try {

    console.log("Ennterd Create Booking..............................");
    const { vehicle_post_id, checkIn, checkOut, total_price } = req.body;

    //console.log("A: "+vehicle_number);

    const owner_id = await pool.query(
      `SELECT customer_id FROM vehicle_post WHERE vehicle_number = $1`,
      [vehicle_post_id]
    );

    const vehicle_owner_id = owner_id.rows[0].customer_id;

    console.log(req.body);
    const numDays = Math.abs(
      Math.ceil(
        (new Date(checkIn) - new Date(checkOut)) / (1000 * 60 * 60 * 24)
      )
    );
    
    //total_price = numDays * total_price;
    console.log('Numdays.....'+numDays)
    const queryText = `
        INSERT INTO booking (vehicle_number, booking_customer_id, start_date, end_date, total_price , owner_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `;
    const values = [
      vehicle_post_id,
      req.user.customer_id,
      checkIn,
      checkOut,
      total_price,
      vehicle_owner_id,
    ];
    const { rows } = await pool.query(queryText, values);
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);

    // if (error.code === 'P0001') {
    //   return res.status(401).json({
    //     message: "Cannot complete booking due to overlapping dates with another accepted booking.",
    //   });
    // }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBookingById = async (req, res) => {
  const user = req.user;
  const { customer_id } = user;
  try {
    const { rows } = await pool.query(
      ` SELECT b.*, vp.*, c.* FROM booking b INNER JOIN vehicle_post vp ON vp.vehicle_number = b.vehicle_number INNER JOIN customer c ON vp.customer_id = c.customer_id WHERE b.booking_customer_id = $1;`,
      [customer_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const bookedByUser = async (req, res) => {
  const { vehicle_number } = req.query;
  const { customer_id } = req.user;

  // check if the user has already booked the vehicle post

  try {
    const { rows } = await pool.query(
      `SELECT * FROM booking WHERE vehicle_number = $1 AND booking_customer_id = $2 
        AND (booking_status = 'Accepted' 
        OR booking_status = 'pending')
      `,
      [vehicle_number, customer_id]
    );

    if (rows.length > 0) {
      if (rows[0].booking_status === "pending") {
        return res.status(202).json({ message: "Pending" });
      }

      return res.status(400).json({
        message: "You have already booked this vehicle post",
      });
    }

    return res.status(200).json({ message: "Not booked" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//get owner vehicles which are listed in the booking table
export const getOwnerVehicles = async (req, res) => {
  const { customer_id } = req.user;

  try {
    const query = `SELECT b.*, vp.vehicle_name, vp.vehicle_image, c.customername, c.phone_number FROM booking b INNER JOIN vehicle_post vp ON vp.vehicle_number = b.vehicle_number INNER JOIN customer c ON c.customer_id = b.booking_customer_id WHERE b.owner_id = $1;`;
    const { rows } = await pool.query(query, [customer_id]);
    console.log('Rows (formatted):', JSON.stringify(rows, null, 2));
    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// accept and reject booking
export const bookingAction = async (req, res) => {
  const { booking_id } = req.query;
  const { booking_status } = req.body;
  const { customer_id } = req.user;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM booking WHERE booking_id = $1 AND owner_id = $2`,
      [booking_id, customer_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const query = `UPDATE booking SET booking_status = $1 WHERE booking_id = $2 RETURNING *`;
    const values = [booking_status, booking_id];
    const response = await pool.query(query, values);
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === 'P0001') {
      return res.status(400).json({
        message: "Cannot accept booking due to overlapping dates with another accepted booking.",
      });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
