import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";

function AddMember() {
  const history = useHistory();

  const token = useSelector((state) => state.auth.token);

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formInput, setFormInput] = useState({
    first_name: "",
    last_name: "",
    emailId: "",
    mobileNumber: "",
    password: "",
    role: "subadmin",
    designation: "",
  });

  const handleInput = (e) => {
    e.persist();
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    switch (name) {
      case "first_name":
        if (value === "") {
          fieldErrors[name] = "First Name is required.";
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          fieldErrors[name] =
            "First Name should only contain alphabets and spaces.";
        } else if (value.length > 30) {
          fieldErrors[name] = "Maximum 30 Characters Allowed.";
        }
        break;

      case "last_name":
        if (value === "") {
          fieldErrors[name] = "Last Name is required.";
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          fieldErrors[name] =
            "Last Name should only contain alphabets and spaces.";
        } else if (value.length > 30) {
          fieldErrors[name] = "Maximum 30 Characters Allowed.";
        }
        break;
      case "emailId":
        if (value === "") {
          fieldErrors[name] = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors[name] = "Invalid email format.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed in Email.";
        }
        break;

      case "mobileNumber":
        if (value === "") {
          if (!/^\d{10}$/.test(value)) {
            fieldErrors[name] = "Mobile Number Required.";
          }
        }
        break;

      case "password":
        if (value === "") {
          fieldErrors[name] = "Password is required.";
        }
        break;

      case "designation":
        if (value === "") {
          fieldErrors[name] = "Designation is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
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

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormInput((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    e.target.classList.remove("is-invalid");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldErrors = {};

    if (
      formInput.first_name === "" ||
      /^\s*$/.test(formInput.first_name) ||
      formInput.first_name.length === 0
    ) {
      fieldErrors.first_name = "First Name is required.";
    } else if (!/^[a-zA-Z\s]*$/.test(formInput.first_name)) {
      fieldErrors.first_name =
        "First Name should only contain alphabets and spaces.";
    } else if (formInput.first_name > 30) {
      fieldErrors.first_name = "Maximum 30 Characters Allowed.";
    }

    if (
      formInput.last_name === "" ||
      /^\s*$/.test(formInput.last_name) ||
      formInput.last_name.length === 0
    ) {
      fieldErrors.last_name = "Last Name is required.";
    } else if (!/^[a-zA-Z\s]*$/.test(formInput.last_name)) {
      fieldErrors.last_name =
        "Last Name should only contain alphabets and spaces.";
    } else if (formInput.last_name > 30) {
      fieldErrors.last_name = "Maximum 30 Characters Allowed.";
    }

    if (
      formInput.emailId === "" ||
      /^\s*$/.test(formInput.emailId) ||
      formInput.emailId.length === 0
    ) {
      fieldErrors.emailId = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formInput.emailId)) {
      fieldErrors.emailId = "Invalid email format.";
    } else if (formInput.emailId > 100) {
      fieldErrors.emailId = "Maximum 100 Characters Allowed.";
    }

    if (formInput.mobileNumber !== "" && formInput.mobileNumber != null) {
      if (
        /^\s*$/.test(formInput.mobileNumber) ||
        !/^\d{10}$/.test(formInput.mobileNumber)
      ) {
        fieldErrors.mobileNumber = "Invalid mobile number. Must be 10 digits.";
      }
    }

    if (
      formInput.designation === "" ||
      /^\s*$/.test(formInput.designation) ||
      formInput.designation.length === 0
    ) {
      fieldErrors.designation = "designation is required.";
    } else if (formInput.designation > 50) {
      fieldErrors.designation = "Maximum 50 Characters Allowed.";
    }

    if (
      formInput.password === "" ||
      /^\s*$/.test(formInput.password) ||
      formInput.password.length === 0
    ) {
      fieldErrors.password = "Password is required";
    } else if (formInput.length < 8) {
      fieldErrors.password = "Password must be at least 8 characters long.";
    } else if (formInput.password > 50) {
      fieldErrors.password = "Maximum 50 Characters Allowed.";
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("first_name", formInput.first_name);
      formData.append("last_name", formInput.last_name);
      formData.append("emailId", formInput.emailId);
      formData.append("mobileNumber", formInput.mobileNumber);
      formData.append("password", formInput.password);
      formData.append("designation", formInput.designation);
      formData.append("role", formInput.role);

      axios
        .post(`/user/add-sub-admin`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
          },
        })
        .then((res) => {
          
          if (res.data.status === true) {
            swal("Success", res.data.message, "success");

            setFormInput({
              first_name: "",
              last_name: "",
              password: "",
              emailId: "",
              mobileNumber: "",
              designation: "",
              role: "subadmin",
            });

            setErrors({});

            history.push(`/admin/all-member`);
          } else if (res.data.status === 422) {
            // console.log("success", res.data.errors);
            setErrors(res.data.errors);
          } else if (res.data.status === false) {
            swal("Error", res.data.message, "error");
            history.push(`/admin/add-member`);
          }
        });
    } else {
      setErrors(fieldErrors);
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="row">
        <div
          className="col-12"
          style={{
            backgroundColor: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
          }}
        >
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Add Member </h1>
            <Link
              to={`/admin/all-member`}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
            </Link>
          </div>
        </div>
      </div>

      <div className="row p-3">
        <div className="col-8">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Add Member</h6>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <form
                    className="user mt-5"
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                  >
                    {/* First Name */}
                    <div className="form-group row">
                      <label
                        forhtml="first_name"
                        className="col-12 col-lg-2 col-form-label"
                      >
                        Name
                      </label>
                      <div className="col-12 col-lg-6 mb-2">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.first_name ? "is-invalid" : ""
                          }`}
                          placeholder="First Name"
                          name="first_name"
                          value={formInput.first_name}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.first_name && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.first_name}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-lg-4">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.last_name ? "is-invalid" : ""
                          }`}
                          placeholder="Last Name"
                          name="last_name"
                          value={formInput.last_name}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.last_name && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.last_name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-group row">
                      <label
                        forhtml="email"
                        className="col-12 col-lg-2 col-form-label"
                      >
                        Email
                      </label>
                      <div className="col-12 col-lg-10 mb-3 mb-sm-0">
                        <div className="form-group">
                          <input
                            type="email"
                            className={`form-control ${
                              errors.emailId ? "is-invalid" : ""
                            }`}
                            placeholder="Email"
                            name="emailId"
                            value={formInput.emailId}
                            onChange={handleInput}
                            onBlur={handleBlur}
                            onFocus={handleInputFocus}
                          />

                          {errors.emailId && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.emailId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Number  */}
                    <div className="form-group row">
                      <label
                        forhtml="mobile_number"
                        className="col-12 col-lg-2 col-form-label"
                      >
                        Mobile
                      </label>
                      <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                        <div className="form-group">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.mobileNumber ? "is-invalid" : ""
                            }`}
                            placeholder="Mobile Number"
                            name="mobileNumber"
                            maxLength={10}
                            value={
                              formInput.mobileNumber === null
                                ? ""
                                : formInput.mobileNumber
                            }
                            onChange={handleInput}
                            onBlur={handleBlur}
                            onFocus={handleInputFocus}
                          />

                          {errors.mobileNumber && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.mobileNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="form-group row">
                      <label
                        forhtml="password"
                        className="col-12 col-lg-2 col-form-label"
                      >
                        Password
                      </label>
                      <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                        <div className="form-group">
                          <input
                            type="password"
                            className={`form-control ${
                              errors.password ? "is-invalid" : ""
                            }`}
                            placeholder="Password"
                            name="password"
                            value={formInput.password}
                            onChange={handleInput}
                            onBlur={handleBlur}
                            onFocus={handleInputFocus}
                          />

                          {errors.password && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.password}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Designation */}
                    <div className="form-group row">
                      <label
                        forhtml="designation"
                        className="col-12 col-lg-2 col-form-label"
                      >
                        Designation
                      </label>
                      <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                        <div className="form-group">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.designation ? "is-invalid" : ""
                            }`}
                            placeholder="Designation"
                            name="designation"
                            value={formInput.designation}
                            onChange={handleInput}
                            onBlur={handleBlur}
                            onFocus={handleInputFocus}
                          />

                          {errors.designation && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.designation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        forhtml="status"
                        className="col-2 col-form-label"
                      ></label>
                      <div className="col-8 mb-3 mb-sm-0">
                        <button
                          className="btn btn-primary btn-user"
                          style={{
                            backgroundColor: "#F5007E",
                            borderColor: "#F5007E",
                            fontSize: "14px",
                            padding: "1% 4%",
                          }}
                        >
                          {"Submit Now"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddMember;
