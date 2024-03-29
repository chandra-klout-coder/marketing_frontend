import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";

import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

function AddMember(props) {
  const history = useHistory();

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState("1");

  const [formInput, setFormInput] = useState({
    first_name: "",
    last_name: "",
    company: "",
    email: "",
    mobile_number: "",
    step: 1,
    mobile_otp: "",
    email_otp: "",
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
      case "email":
        if (value === "") {
          fieldErrors[name] = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors[name] = "Invalid email format.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed in Email.";
        }
        break;

      case "mobile_number":
        if (value !== "") {
          if (!/^\d{10}$/.test(value)) {
            fieldErrors[name] = "Invalid Mobile number. Must be 10 digits.";
          }
        }
        break;

      case "company":
        if (value === "") {
          fieldErrors[name] = "Company is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "mobile_otp":
        if (value !== "") {
          if (!/^\d{6}$/.test(value)) {
            fieldErrors[name] = "Valid OTP required";
          }
        }
        break;

      case "email_otp":
        if (value !== "") {
          if (!/^\d{6}$/.test(value)) {
            fieldErrors[name] = "Valid OTP required";
          }
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
      formInput.email === "" ||
      /^\s*$/.test(formInput.email) ||
      formInput.email.length === 0
    ) {
      fieldErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formInput.email)) {
      fieldErrors.email = "Invalid email format.";
    } else if (formInput.email > 100) {
      fieldErrors.email = "Maximum 100 Characters Allowed.";
    }

    if (formInput.mobile_number != "" && formInput.mobile_number != null) {
      if (
        /^\s*$/.test(formInput.mobile_number) ||
        !/^\d{10}$/.test(formInput.mobile_number)
      ) {
        fieldErrors.mobile_number = "Invalid mobile number. Must be 10 digits.";
      }
    }

    if (
      formInput.company === "" ||
      /^\s*$/.test(formInput.company) ||
      formInput.company.length === 0
    ) {
      fieldErrors.company = "Company is required.";
    } else if (formInput.company > 50) {
      fieldErrors.company = "Maximum 50 Characters Allowed.";
    }

    if (formInput.email_otp !== "") {
      if (
        formInput.email_otp.length === 0 ||
        !/^\d{6}$/.test(formInput.email_otp)
      ) {
        fieldErrors.email = "Valid OTP required.";
      }
    }

    if (formInput.mobile_otp !== "") {
      if (
        formInput.mobile_otp.length === 0 ||
        !/^\d{6}$/.test(formInput.mobile_otp)
      ) {
        fieldErrors.mobile_otp = "Valid OTP required.";
      }
    }

    if (Object.keys(fieldErrors).length === 0) {

      // setStep("2");

      setIsLoading(true);

      const formData = new FormData();

      formData.append("first_name", formInput.first_name);
      formData.append("last_name", formInput.last_name);
      formData.append("company", formInput.company);
      formData.append("email", formInput.email);
      formData.append("mobile_number", formInput.mobile_number);
      formData.append("mobile_otp", formInput.mobile_otp);
      formData.append("email_otp", formInput.email_otp);

      formData.append("step", 2);

      axios
        .post(`/api/members`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            
            swal("Success", res.data.message, "success");

            setFormInput({
              ...formInput,
              first_name: "",
              last_name: "",
              company: "",
              email: "",
              mobile_number: "",
              step: "",
              mobile_otp: "",
              email_otp: "",
            });

            setErrors({});

            history.push(`/admin/all-member`);
          } else if (res.data.status === 422) {
            // console.log("success", res.data.errors);
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            swal("All fields are mandatory", "", "error");
            history.push(`/admin/all-member`);
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
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Add Member</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <h5 className="text-center">Add Member Details</h5>
                <hr />
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
                    <div className="col-12 col-lg-3 mb-2">
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

                    <div className="col-12 col-lg-3">
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
                    <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="Email"
                          name="email"
                          value={formInput.email}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.email && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.email}
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
                      Mobile Number
                    </label>
                    <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.mobile_number ? "is-invalid" : ""
                          }`}
                          placeholder="Mobile Number"
                          name="mobile_number"
                          maxLength={10}
                          value={
                            formInput.mobile_number === null
                              ? ""
                              : formInput.mobile_number
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.mobile_number && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.mobile_number}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="form-group row">
                    <label
                      forhtml="company_name"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Company
                    </label>
                    <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="company"
                          className={`form-control ${
                            errors.company ? "is-invalid" : ""
                          }`}
                          placeholder="Company"
                          name="company"
                          value={formInput.company}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.company && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Otp verificastion  */}

                  {step === "2" && (
                    <>
                      {/* Mobile OTP */}
                      <div className="form-group row">
                        <label
                          forhtml="mobile_otp"
                          className="col-12 col-lg-2 col-form-label"
                        >
                          Mobile OTP
                        </label>
                        <div className="col-12 col-lg-2 mb-3 mb-sm-0">
                          <div className="form-group">
                            <input
                              type="company"
                              className={`form-control ${
                                errors.mobile_otp ? "is-invalid" : ""
                              }`}
                              placeholder="Mobile OTP"
                              name="mobile_otp"
                              maxLength={6}
                              value={formInput.mobile_otp}
                              onChange={handleInput}
                              onBlur={handleBlur}
                              onFocus={handleInputFocus}
                            />

                            {errors.mobile_otp && (
                              <div
                                className="invalid-feedback"
                                style={{
                                  textAlign: "left",
                                }}
                              >
                                {errors.mobile_otp}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Email OTP */}
                      <div className="form-group row">
                        <label
                          forhtml="email_otp"
                          className="col-12 col-lg-2 col-form-label"
                        >
                          Verify Email OTP
                        </label>
                        <div className="col-12 col-lg-2 mb-3 mb-sm-0">
                          <div className="form-group">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.email_otp ? "is-invalid" : ""
                              }`}
                              placeholder="Email OTP"
                              name="email_otp"
                              maxLength={6}
                              value={formInput.email_otp}
                              onChange={handleInput}
                              onBlur={handleBlur}
                              onFocus={handleInputFocus}
                            />

                            {errors.email_otp && (
                              <div
                                className="invalid-feedback"
                                style={{
                                  textAlign: "left",
                                }}
                              >
                                {errors.email_otp}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

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
                        {step === "1" && <>{"Sent OTP Now"}</>}
                        {step === "2" && <>{"Verify and Save"}</>}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddMember;
