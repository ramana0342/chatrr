
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userId } from "../utils/idGenerator.js";

import {
  insertUserRegisterData,
  findUserByIdentifier,
  findUserById
} from "../models/userRegisterFlowModel.js";
import { getIdentifierType } from "../utils/identifierType.js";
import { refreshCookieOptions } from "../config/cookie.js";

export const handleRegister = async (req, res) => {
  try {
    const { name, user_name, identifier, password } = req.body;

    if (!user_name?.trim() || !password?.trim()) {
      return res.status(400).json({
        status: { code: 400, message: "Username and password are required" },
        response: null
      });
    }


    const existingUser = await findUserByIdentifier(user_name || identifier);


    if (existingUser) {
      return res.status(409).json({
        status: { code: 409, message: "Username already taken" },
        response: null
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const type = getIdentifierType(identifier);
    const value = identifier.trim();

    const data = {
      id: userId(),
      name: name || null,
      user_name,
      email: type === "email" ? value : null,
      mobile_number: type === "mobile" ? value : null,
      password: hashedPassword,
      profile_pic: null
    };

    const result = await insertUserRegisterData(data);

    // =========================
    // GENERATE TOKENS
    // =========================

    const accessToken = jwt.sign(
      {
        id: data.id,
        user_name: data.user_name,
        name: data.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        id: data.id,
        user_name: data.user_name,
        name: data.name
      },
      process.env.REFRESH_SECRET,
      { expiresIn: "2d" }
    );

    // return res.status(201).json({
    //   status: { code: 201, message: "Account created successfully" },
    //   response: result
    // });

    // SAVE REFRESH TOKEN
    res.cookie(
      "refreshToken",
      refreshToken,
      refreshCookieOptions
    );

    return res.status(201).json({
      status: {
        code: 201,
        message:
          "Account created successfully"
      },
      response: {
        accessToken,
        user: result
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: { code: 500, message: error.message },
      response: null
    });
  }
};


// =====================================
// LOGIN
// =====================================

export const handleLogin = async (req, res) => {
  try {

    const { identifier, password } = req.body;

    if (!identifier?.trim() || !password?.trim()) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Enter login ID and password"
        },
        response: null
      });
    }

    const user = await findUserByIdentifier(identifier);

    if (!user) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Wrong login details"
        },
        response: null
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: {
          code: 400,
          message: "Wrong login details"
        },
        response: null
      });
    }



    const accessToken = jwt.sign(
      {
        id: user.id,
        user_name: user.user_name,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        user_name: user.user_name,
        name: user.name
      },
      process.env.REFRESH_SECRET,
      { expiresIn: "2d" }
    );

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      status: {
        code: 200,
        message: "Welcome back"
      },
      response: {
        accessToken,
        user
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: {
        code: 500,
        message: error.message
      },
      response: null
    });
  }
};

export const handleGetUserProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const user = await findUserById(userId);

    res.status(200).json({
      status: {
        code: 200,
        message: ""
      },
      response: {
        user
      }
    });

  } catch (error) {

    res.status(500).json({
      status: { code: 500, message: error.message },
    });
  }
}

