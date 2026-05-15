import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import "../styles/AuthPage.scss";
import { userRegister, userLogin } from "../network/chatrrApiService/chatrrApiService";
import { store } from "./mainHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProductLogo from "../assets/product-logo.png"


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [setUserDetails] = useContext(store)
  const navigate = useNavigate()
  const [loginLoading, setLoginLoading] =
    useState(false);

  const [registerLoading, setRegisterLoading] =
    useState(false);

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegister,
    formState: { errors: registerErrors }
  } = useForm({
    mode: "onChange"
  });

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    formState: { errors: loginErrors }
  } = useForm({
    mode: "onChange"
  });

  const validateIdentifier = (value) => {
    if (!value || !value.trim()) return true;

    if (/\s/.test(value)) {
      return "Spaces are not allowed";
    }

    const val = value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const userIdRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;

    if (
      emailRegex.test(val) ||
      mobileRegex.test(val) ||
      userIdRegex.test(val)
    ) {
      return true;
    }

    return "Enter valid Email or Mobile";
  };


  const validateName = (value) => {
    if (!value) return "User name is required";

    if (/^\s/.test(value)) {
      return "Leading space not allowed";
    }

    if (/\s$/.test(value)) {
      return "Trailing space not allowed";
    }

    if (/\s{2,}/.test(value)) {
      return "Consecutive spaces not allowed";
    }

    const v = value.trim();

    if (v.length < 3) {
      return "Minimum 3 characters required";
    }

    if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(v)) {
      return "Only letters allowed";
    }

    return true;
  };

  const validateUserName = (value) => {
    if (!value) return "User name is required";

    if (/\s/.test(value)) {
      return "Spaces are not allowed";
    }

    if (value.length < 6) {
      return "Minimum 3 characters required";
    }

    return true;
  };


  const validatePassword = (value) => {
    if (!value) return "Password is required";

    if (/\s/.test(value)) {
      return "Spaces are not allowed in password";
    }

    if (value.length < 6) {
      return "Minimum 6 characters required";
    }

    return true;
  };


  // =========================
  // REGISTER SUBMIT
  // =========================

  const onRegister = async (data) => {

    try {
      setRegisterLoading(true);
      const res = await userRegister(data);
      if (res?.status?.code === 201) {
        setUserDetails(res?.response?.user)
        localStorage.setItem("accesstoken", res.response.accessToken)
        navigate("/")
      }
    } catch (err) {
      toast.error(err?.response?.data?.status?.message);
      console.log("REGISTER ERROR:", err);

    } finally {

      setRegisterLoading(false);
    }
  };

  // =========================
  // LOGIN SUBMIT
  // =========================

  const onLogin = async (data) => {
    try {
      setLoginLoading(true);
      const res = await userLogin(data);
      if (res.status.code === 200) {
        setUserDetails(res?.response?.user)
        localStorage.setItem("accesstoken", res.response.accessToken)
        navigate("/")
      }
    } catch (err) {
      toast.error(err?.response?.data?.status?.message);
      console.log("REGISTER ERROR:", err);

    } finally {
      setLoginLoading(false);
    }
  };

  const handleTabChange = (type) => {

  setIsLogin(type);

  // CLEAR LOGIN FORM
  resetLogin();

  // CLEAR REGISTER FORM
  resetRegister();
};

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="product-img-container">
          <img src = "/preview.png" className="product-img" alt = "Product Image"/>
          </div>
          <p>
            Connect instantly with friends and teams.
            Secure messaging with modern real-time chat experience.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="auth-form-container">

            {/* TOGGLE */}
            <div className="auth-top-buttons">
              <button
                className={isLogin ? "active" : ""}
                onClick={() => handleTabChange(true)}
              >
                Login
              </button>

              <button
                className={!isLogin ? "active" : ""}
                onClick={() => handleTabChange(false)}
              >
                Register
              </button>
            </div>

            <h2>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="auth-subtitle">
              {isLogin
                ? "Login to continue chatting"
                : "Create your account to start chatting"}
            </p>

            {/* =========================
                LOGIN FORM
            ========================= */}

            {isLogin ? (
              <form onSubmit={handleLoginSubmit(onLogin)}>

                <div className="input-group">
                  <label>Email / Mobile / User ID</label>

                  <input
                    type="text"
                    placeholder="Enter email / mobile / user id"
                    {...registerLogin("identifier", {
                      validate: validateIdentifier
                    })}
                  />

                  {loginErrors.identifier && (
                    <p className="error-text">
                      {loginErrors.identifier.message}
                    </p>
                  )}
                </div>

                <div className="input-group">
                  <label>Password</label>

                  <input
                    type="password"
                    placeholder="Enter password"
                    {...registerLogin("password", {
                      validate: validatePassword
                    })}
                  />

                  {loginErrors.password && (
                    <p className="error-text">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loginLoading}
                >

                  {loginLoading ? (
                    <>
                      <span
                        className="
          spinner-border
          spinner-border-sm
        "
                        role="status"
                        aria-hidden="true"
                      ></span>

                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}

                </button>
              </form>
            ) : (

              /* =========================
                  REGISTER FORM
              ========================= */

              <form onSubmit={handleRegisterSubmit(onRegister)}>

                <div className="input-group">
                  <label>Create Your User Name</label>

                  <input
                    type="text"
                    placeholder="Enter user name"
                    {...registerRegister("user_name", {
                      validate: validateUserName
                    })}
                  />

                  {registerErrors.user_name && (
                    <p className="error-text">
                      {registerErrors.user_name.message}
                    </p>
                  )}
                </div>

                <div className="input-group">
                  <label>Email / Mobile (Optional)</label>

                  <input
                    type="text"
                    placeholder="Enter email / mobile"
                    {...registerRegister("identifier", {
                      validate: validateIdentifier
                    })}
                  />

                  {registerErrors.identifier && (
                    <p className="error-text">
                      {registerErrors.identifier.message}
                    </p>
                  )}
                </div>

                <div className="input-group">
                  <label>Name</label>

                  <input
                    type="text"
                    placeholder="Enter name"
                    {...registerRegister("name", {
                      validate: validateName
                    })}
                  />

                  {registerErrors.name && (
                    <p className="error-text">
                      {registerErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="input-group">
                  <label>Password</label>

                  <input
                    type="password"
                    placeholder="Enter password"
                    {...registerRegister("password", {
                      validate: validatePassword
                    })}
                  />

                  {registerErrors.password && (
                    <p className="error-text">
                      {registerErrors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={registerLoading}
                >

                  {registerLoading ? (
                    <>
                      <span
                        className="
          spinner-border
          spinner-border-sm
        "
                        role="status"
                        aria-hidden="true"
                      ></span>

                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}

                </button>

              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;