import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";
import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

import { useSelector } from "react-redux";

function EditAttendee(props) {
  const history = useHistory();

  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [formInput, setFormInput] = useState({
    first_name: "",
    last_name: "",
    emailId: "",
    mobileNumber: "",
    image: null,
    new_image: null,
  });

  useEffect(() => {
    axios
      .post(
        `/user/details`,
        { userId },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        if (res.data.status === true) {
          setFormInput(res.data.result.user);
        } else if (res.data.status === 400) {
          // swal("Error", res.data.message, "error");
          // history.push("/admin/all-attendees");
        }
      });
  }, [token]);

  console.log("user input", formInput);

  const handleInput = (e) => {
    e.persist();
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormInput((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    e.target.classList.remove("is-invalid");
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
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "last_name":
        if (value === "") {
          fieldErrors[name] = "Last Name is required.";
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          fieldErrors[name] =
            "Last Name should only contain alphabets and spaces.";
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
          fieldErrors[name] = "Invalid Mobile number. Must be 10 digits.";
        }
        break;

      default:
        break;
    }
    // Add other validation rules as needed for other fields

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldErrors,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFormInput((prevData) => ({
      ...prevData,
      new_image: file,
    }));
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
    } else if (formInput.first_name > 50) {
      fieldErrors.first_name = "Maximum 50 Characters Allowed.";
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
    } else if (formInput.last_name > 50) {
      fieldErrors.last_name = "Maximum 50 Characters Allowed.";
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

    if (!/^\d{10}$/.test(formInput.mobileNumber)) {
      fieldErrors.mobileNumber = "Invalid mobile number. Must be 10 digits.";
    }

    // if (formInput.new_image !== "") {
    //   const allowedFormats = ["image/jpeg", "image/png", "image/gif"];

    //   if (formInput.new_image) {
    //     if (!allowedFormats.includes(formInput.new_image.type)) {
    //       fieldErrors.new_image =
    //         "Invalid file format. Only JPEG and PNG formats are allowed.";
    //     }
    //   }
    // }

    // let image = {};

    // if (formInput.new_image !== "") {
    //   image = formInput.new_image;
    // } else {
    //   image = formInput.image;
    // }

    if (Object.keys(fieldErrors).length === 0) {
      const formData = new FormData();

      setIsLoading(true);

      // formData.append("image", image);
      formData.append("first_name", formInput.first_name);
      formData.append("last_name", formInput.last_name);
      formData.append("email", formInput.emailId);
      formData.append("mobile", formInput.mobileNumber);

      axios
        .post(`/api/updateprofile`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setErrors({});

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else if (res.data.status === 422) {
            setErrors(res.data.error);
          } else if (res.data.status === 400) {
            // swal("All fields are mandatory", "", "error");
            // history.push(`/admin/all-attendee/${event_id}`);
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
            <h1 className="h3 mb-0 text-gray-800">Profile</h1>
            <Link
              to={`/admin/dashboard`}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go To
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Edit Profile</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <form
                  className="user mt-5"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  {/* Name */}
                  <div className="form-group row">
                    <label
                      forhtml="first_name"
                      className="col-12 col-lg-2 col-form-label col-auto"
                    >
                      First Name
                    </label>
                    <div className="col-5">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.first_name ? "is-invalid" : ""
                        }`}
                        placeholder="First Name"
                        name="first_name"
                        maxLength={50}
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

                    <div className="col-5">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.last_name ? "is-invalid" : ""
                        }`}
                        placeholder="Last Name"
                        name="last_name"
                        maxLength={50}
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

                  {/* Event Venue  */}
                  <div className="form-group row">
                    <label
                      forhtml="email"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Email
                    </label>
                    <div className="col-10 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="email"
                          className={`form-control ${
                            errors.emailId ? "is-invalid" : ""
                          }`}
                          readOnly
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

                  {/* Phone Number  */}
                  <div className="form-group row">
                    <label
                      forhtml="mobile_number"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Mobile Number
                    </label>
                    <div className="col-10 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.mobileNumber ? "is-invalid" : ""
                          }`}
                          readOnly
                          placeholder="Mobile Number"
                          name="mobileNumber"
                          value={formInput.mobileNumber}
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

                  {/* File - Event Image  */}
                  <div className="form-group row">
                    <label
                      forhtml="file"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Profile Picture
                    </label>
                    <div className="col-10 col-lg-5">
                      <input
                        type="file"
                        className={`form-control ${
                          errors.new_image ? "is-invalid" : ""
                        }`}
                        name="file"
                        onChange={handleFileChange}
                        onBlur={handleBlur}
                      />

                      {errors.new_image && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.new_image}
                        </div>
                      )}
                    </div>

                    <div className="col-10 col-lg-5 mt-3">
                      {formInput.new_image && (
                        <img
                          src={URL.createObjectURL(formInput.new_image)}
                          width="60%"
                          alt="defaultUser"
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      )}

                      {formInput.image && !formInput.new_image && (
                        <img
                          src={imageBaseUrl + formInput.image}
                          width="60%"
                          alt={formInput.image}
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      )}

                      {!formInput.image && !formInput.new_image && (
                        <img
                          src={Defaultuser}
                          width="60%"
                          alt="defaultUser"
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      )}
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
                          padding: "1% 6%",
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
                          "Update"
                        )}
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

export default EditAttendee;
