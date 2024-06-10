import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";
import loadingGif from "../assets/images/load.gif";

import backgroundImage from "../assets/images/1.jpg";

const OtpVerification = ({
  formData,
  setFormData,
  onComplete,
  prevStep,
  currentStep,
}) => {
  const history = useHistory();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 6000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showAlert]);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleInput = (e) => {
    e.persist();
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior (form submission)
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    switch (name) {
      case "otp":
        if (value === "") {
          fieldErrors[name] = "OTP is required.";
        } else if (!/^\d{6}$/.test(value)) {
          fieldErrors[name] = "Enter 6 Digits OTP.";
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
    setFormData((prevValidFields) => ({ ...prevValidFields, [name]: value }));

    e.target.classList.remove("is-invalid");
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const fieldErrors = {};

    formData.step = currentStep;

    if (formData.otp === "" || /^\s*$/.test(formData.otp)) {
      fieldErrors.otp = "OTP is required.";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      fieldErrors.otp = "Enter 6 Digits OTP.";
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      await axios
        .post(`/user/register`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === true) {

            swal("Success", res.data.message, "success");

            setErrors({});

            setFormData({});

            history.push("/login");
          } else if (res.data.status === 401) {
            swal("Warning", res.data.message, "warning");
          } else if (res.data.status === 400 && res.data.error === "otp") {
            setErrors({ otp: res.data.message });
          }
        });
    } else {
      setErrors(fieldErrors);
    }
    setIsLoading(false);
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          {/* <!-- Nested Row within Card Body --> */}
          <div className="row">
            <div
              className="col-lg-5 d-none d-lg-block"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover", // Adjust as needed
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
                  <h1 className="h4 text-gray-900 mb-4">OTP Verification</h1>

                  {showAlert && (
                    <div
                      className="alert alert-success alert-dismissible fade show"
                      role="alert"
                    >
                      <strong>Success!</strong> You will get OTP verification
                      Codes on Email and Mobile No.
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        onClick={handleCloseAlert}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                  )}
                </div>

                <form className="user" onSubmit={handleVerifyOTP}>
                  <div className="form-group row">
                    {/* {errors.error && <p className="error">{errors.error}</p>} */}
                    {/* {success && <p className="success">{success}</p>} */}
                  </div>

                  <div className="form-group">
                    <label>
                      Enter the OTP received on Mobile :
                      <strong>
                        {" "}
                        {"+91"}
                        {"-"}
                        {formData.mobile}
                      </strong>{" "}
                      or Email :<strong> {formData.email}</strong>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-user col-4 ${
                        errors.otp ? "is-invalid" : ""
                      }`}
                      placeholder="OTP"
                      name="otp"
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                    />
                    {errors.otp && (
                      <div
                        className="invalid-feedback"
                        style={{ textAlign: "left", padding: " 0px 1.2rem" }}
                      >
                        {errors.otp}
                      </div>
                    )}
                  </div>

                  <div>
                    {currentStep === 2 && (
                      <>
                        <button
                          className="btn btn-primary btn-user btn-lg"
                          onKeyDown={handleKeyDown}
                          onClick={prevStep}
                          disabled={isLoading}
                        >
                          <i className="fa fa-arrow-left"></i> Previous
                        </button>
                        &nbsp;
                        <button
                          type="submit"
                          onKeyDown={handleKeyDown}
                          className="btn btn-primary btn-user btn-lg mt-2"
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
                            "Verify OTP and Submit"
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
