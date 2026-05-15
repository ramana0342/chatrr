import bcrypt from "bcrypt";
import pool from "./config/database.js";

const seedAdmin = async () => {
    try {
        // check if admin already exists
        const check = await pool.query(
            `SELECT * FROM my_portfolio.admin WHERE id = $1`,
            ["portfolio_main_admin"]
        );

        if (check.rows.length > 0) {
            console.log("Admin already exists. Skipping seed.");
            return;
        }

        // hash password
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        // insert admin
        await pool.query(
            `INSERT INTO my_portfolio.admin 
      (email, mobile, password)
      VALUES ($1, $2, $3)`,
            [
                process.env.ADMIN_EMAIL,
                process.env.ADMIN_MOBILE,
                hashedPassword
            ]
        );

        console.log("Admin created successfully");
    } catch (error) {
        console.error("Error creating admin:", error.message);
    } finally {
        pool.end();
    }
};

seedAdmin();