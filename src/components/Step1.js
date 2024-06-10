import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";
import loadingGif from "../assets/images/load.gif";

import backgroundImage from "../assets/images/3.jpg";

const Step1 = ({
  formData,
  setFormData,
  nextStep,
  currentStep,
  isTncChecked,
  setTncChecked,
}) => {
  const [errors, setErrors] = useState({
    first_name: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [isNotificationsChecked, setNotificationsChecked] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

  const handleInput = (e) => {
    e.persist();

    const { name, value } = e.target;

    if (name === "tnc") {
      setTncChecked(!isTncChecked);
    }

    if (name === "notifications") {
      setNotificationsChecked(!isNotificationsChecked);
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    switch (name) {
      case "first_name":
        if (value === "") {
          fieldErrors[name] = "First Name is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "last_name":
        if (value === "") {
          fieldErrors[name] = "Last Name is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "email":
        if (value === "") {
          fieldErrors[name] = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors[name] = "Invalid email format.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed in Email.";
        }
        break;

      case "mobile":
        if (value === "") {
          fieldErrors[name] = "Mobile No. is required.";
        } else if (!/^\d{10}$/.test(value)) {
          fieldErrors[name] = "Invalid mobile number. Must be 10 digits.";
        }
        break;

      case "password":
        if (value === "") {
          fieldErrors[name] = "Password is required.";
        } else if (value.length > 255) {
          fieldErrors[name] = "Maximum 255 Characters Allowed.";
        } else if (!passwordRegex.test(value)) {
          fieldErrors[name] =
            "Password must be at least 8 characters long, at least one lowercase letter, one uppercase letter, and one special symbol (!@#$%^&*()_+)";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldErrors,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormData((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    e.target.classList.remove("is-invalid");
  };

  const capitalizeFirstLetter = (text) => {
    if (typeof text !== "string" || text.length === 0) {
      return text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleNext = async (e) => {
    e.preventDefault();

    formData.step = currentStep;

    const fieldErrors = {};

    if (formData.first_name === "" || /^\s*$/.test(formData.first_name)) {
      fieldErrors.first_name = "First Name is required.";
    } else if (formData.first_name.length > 100) {
      fieldErrors.first_name = "Maximum 100 Characters Allowed.";
    }

    if (formData.last_name === "" || /^\s*$/.test(formData.last_name)) {
      fieldErrors.last_name = "Last Name is required.";
    } else if (formData.last_name.length > 100) {
      fieldErrors.last_name = "Maximum 100 Characters Allowed.";
    }

    if (formData.email === "" || /^\s*$/.test(formData.email)) {
      fieldErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      fieldErrors.email = "Invalid email format.";
    } else if (formData.email.length > 100) {
      fieldErrors.email = "Maximum 100 Characters Allowed in Email.";
    }

    if (formData.mobile === "" || /^\s*$/.test(formData.mobile)) {
      fieldErrors.mobile = "Mobile No. is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      fieldErrors.mobile = "Invalid mobile number. Must be 10 digits.";
    }

    if (formData.password === "" || /^\s*$/.test(formData.password)) {
      fieldErrors.password = "Password is required.";
    } else if (formData.password.length > 255) {
      fieldErrors.password = "Maximum 255 Characters Allowed.";
    } else if (!passwordRegex.test(formData.password)) {
      fieldErrors.password =
        "Password must be at least 8 characters long, at least one lowercase letter, one uppercase letter, and one special symbol (!@#$%^&*()_+)";
    }

    if (!isTncChecked) {
      fieldErrors.tnc = "Tnc is required.";
    }

    if (Object.keys(fieldErrors).length === 0) {

      setIsLoading(true);

      await axios
        .post(`/user/register`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status == 200) {
            nextStep();
          } else if (res.data.status === false) {
            setErrors(res.data.error);
          }
        });
    } else {
      setErrors(fieldErrors);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="container">
        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            {/* <!-- Nested Row within Card Body --> */}
            <div className="row">
              <div
                className="col-lg-5 d-none d-lg-block"
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="mb-4">
                    <Link to="/">
                      <i className="fa fa-solid fa-arrow-left"></i>
                      &nbsp; Go Back to Home
                    </Link>
                  </div>

                  <div className="">
                    <h1 className="h4 text-gray-900 mb-4">
                      Welcome! Sign up here
                    </h1>
                  </div>

                  <form className="user" onSubmit={handleNext}>
                    {/* {errors && errors.length > 0 && (
                      <>
                        <div
                          className="alert alert-warning alert-dismissible fade show"
                          role="alert"
                        >
                          <strong>Holy guacamole!</strong> You should check in
                          on some of those fields below.
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          ></button>
                        </div>
                      </>
                    )} */}
                    {/* First and Last Name */}
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          className={`form-control form-control-user ${
                            errors.first_name ? "is-invalid" : ""
                          }`}
                          placeholder="First Name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.first_name && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                              padding: " 0px 1.2rem",
                            }}
                          >
                            {errors.first_name}
                          </div>
                        )}
                      </div>

                      <div className="col-sm-6">
                        <input
                          type="text"
                          className={`form-control form-control-user ${
                            errors.last_name ? "is-invalid" : ""
                          }`}
                          placeholder="Last Name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />
                        {errors.last_name && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                              padding: " 0px 1.2rem",
                            }}
                          >
                            {errors.last_name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="form-group">
                      <input
                        type="text"
                        className={`form-control form-control-user ${
                          errors.mobile ? "is-invalid" : ""
                        }`}
                        placeholder="Mobile Number"
                        name="mobile"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />
                      {errors.mobile && (
                        <div
                          className="invalid-feedback"
                          style={{ textAlign: "left", padding: " 0px 1.2rem" }}
                        >
                          {capitalizeFirstLetter(errors.mobile)}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <input
                        type="email"
                        className={`form-control form-control-user ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />
                      {errors.email && (
                        <div
                          className="invalid-feedback"
                          style={{ textAlign: "left", padding: " 0px 1.2rem" }}
                        >
                          {capitalizeFirstLetter(errors.email)}
                        </div>
                      )}
                    </div>

                    {/* Password */}
                    <div className="form-group row">
                      <div className="col-sm-12 mb-sm-0 input-group">
                        <input
                          className={`form-control form-control-user ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          placeholder="Password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        <div className="input-group-append">
                          <span
                            className="input-group-text"
                            onClick={handleTogglePassword}
                          >
                            <i
                              className={
                                showPassword ? "fas fa-eye-slash" : "fas fa-eye"
                              }
                            ></i>
                          </span>
                        </div>

                        {errors.password && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                              padding: " 0px 1.2rem",
                            }}
                          >
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="form-group row">
                      <div
                        className="form-check form-check-inline mb-4"
                        style={{
                          float: "left",
                          paddingLeft: "0em",
                          marginLeft: "16px",
                        }}
                      >
                        <input
                          className={`${errors.tnc ? "is-invalid" : ""}`}
                          type="checkbox"
                          name="tnc"
                          checked={isTncChecked}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />
                        <label className="form-check-label d-inline">
                          &nbsp; I agree to company T&C and Privacy Policy.
                        </label>
                        {errors.tnc && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                              padding: " 0px 1.2rem",
                            }}
                          >
                            {errors.tnc}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="form-group row"
                      style={{ marginLeft: "5px" }}
                    >
                      <button
                        type="submit"
                        className="btn btn-primary btn-user btn-block"
                        style={{
                          backgroundColor: "#F5007E",
                          borderColor: "#F5007E",
                          color: "#FFFFFF",
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <img
                            src={loadingGif}
                            alt="Loading..."
                            style={{ width: "20px", height: "20px" }}
                          />
                        ) : (
                          <>
                            Proceed to Next Step{" "}
                            <i className="fa fa-arrow-right"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <hr />

                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="small"
                      href="forgot-password.html"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="text-center">
                    <Link to="/login" className="small" href="register.html">
                      Already have an account?{" "}
                      <span
                        style={{ color: "rgb(245, 0, 126)" }}
                        className="fw-bold"
                      >
                        Login!
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1;
