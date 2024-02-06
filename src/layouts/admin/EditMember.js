import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

import loadingGif from "../../assets/images/load.gif";

function EditMember(props) {
  const history = useHistory();

  const member_id = props.match.params.id;

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [memberId, setMemberId] = useState("");


  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [formInput, setFormInput] = useState({
    member_id: member_id,
    first_name: "",
    last_name: "",
    company: "",
    email: "",
    mobile_number: "",
  });

  useEffect(() => {
    axios.get(`/api/members/${member_id}`).then((res) => {
      if (res.data.status === 200) {
        setMemberId(res.data.data.id);
        setFormInput(res.data.data);
      } else if (res.data.status === 400) {
        swal("Error", res.data.message, "error");
        history.push("/admin/all-member");
      }
    });
  }, [member_id]);

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

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("id", formInput.member_id);
      formData.append("first_name", formInput.first_name);
      formData.append("last_name", formInput.last_name);
      formData.append("company", formInput.company);
      formData.append("email", formInput.email);
      formData.append("mobile_number", formInput.mobile_number);
      formData.append("_method", "PUT");

      axios
        .post(`/api/members/${member_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setFormInput({
              ...formInput,
              member_id: "",
              first_name: "",
              last_name: "",
              company: "",
              email: "",
              mobile_number: "",
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
            <h1 className="h3 mb-0 text-gray-800">Edit Member </h1>
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
            <h6 className="m-0 font-weight-bold text-primary">Edit Member</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <h5 className="text-center">Edit Member Details</h5>
                <hr />
                <form
                  className="user mt-5"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  {/* Name */}
                  <div className="form-group row">
                    <label
                      forhtml="first_name"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Name
                    </label>
                    <div className="col-12 col-lg-5 mb-2">
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

                    <div className="col-12 col-lg-5">
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

                  {/* Event Venue  */}
                  <div className="form-group row">
                    <label
                      forhtml="email"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Email
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          readOnly
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

                  {/* Phone Number  */}
                  <div className="form-group row">
                    <label
                      forhtml="phone_number"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Mobile Number
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          readOnly
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
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
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
                            alt="Loading"
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

export default EditMember;
