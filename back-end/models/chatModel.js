
import pool from "../config/database.js";


export const getUsersList = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM chatrr_app.users
    WHERE id != $1
    `,
    [userId]
  );

  return result.rows;
};

export const saveMessage = async (
  id,
  sender_id,
  receiver_id,
  message
) => {

  const result = await pool.query(
    `
    INSERT INTO chatrr_app.messages
    (
      id,
      sender_id,
      receiver_id,
      message
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [id, sender_id, receiver_id, message]
  );

  return result.rows[0];
};


export const getChatMessagesByUser =
  async (
    sender_id,
    receiver_id
  ) => {

    const result =
      await pool.query(

        `SELECT *
         FROM chatrr_app.messages

         WHERE
         (
           sender_id = $1
           AND receiver_id = $2
         )

         OR
         (
           sender_id = $2
           AND receiver_id = $1
         )

         ORDER BY created_at ASC`,

        [sender_id, receiver_id]
      );

    return result.rows;
};


export const markMessagesAsRead = async (
  senderId,
  receiverId
) => {

  const query = `
  
    UPDATE chatrr_app.messages

    SET is_read = true

    WHERE sender_id = $1

    AND receiver_id = $2

    AND is_read = false
  `;

  await pool.query(query, [
    senderId,
    receiverId,
  ]);
};