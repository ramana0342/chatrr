import pool from "../config/database.js";
import { getIdentifierType } from "../utils/identifierType.js";

export const insertUserRegisterData = async (data) => {
  const {
    id,
    name,
    user_name,
    email,
    mobile_number,
    password,
    profile_pic
  } = data;

  const result = await pool.query(
    `INSERT INTO chatrr_app.users (
        id,
        name,
        user_name,
        email,
        mobile_number,
        password,
        profile_pic
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      id,
      name,
      user_name,
      email || null,
      mobile_number || null,
      password,
      profile_pic || null
    ]
  );

  return result.rows[0];
};

export const findUserByIdentifier = async (identifier) => {

  const type = getIdentifierType(identifier);
  const value = identifier.trim();

  let query = "";
  let params = [];

  if (type === "email") {
    query = "SELECT * FROM chatrr_app.users WHERE email = $1";
    params = [value];
  }

  if (type === "mobile") {
    query = "SELECT * FROM chatrr_app.users WHERE mobile_number = $1";
    params = [value];
  }

  if (type === "user_name") {
    query = "SELECT * FROM chatrr_app.users WHERE user_name = $1";
    params = [value];
  }

  const result = await pool.query(query, params);
  return result.rows[0];
};


export const findUserById = async (userId) => {
  const result = await pool.query("SELECT * FROM chatrr_app.users WHERE id = $1", [userId]);
  return result.rows[0];
};