import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";

import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

function EditAttendee(props) {

  const history = useHistory();

  const user_id = props.match.params.id;

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [eventId, setEventId] = useState("");

  const [orginalEventId, setOrginalEventId] = useState(null);
  // const [file, setFile] = useState(null);
  // const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formInput, setFormInput] = useState({
    event_id: eventId,
    first_name: "",
    last_name: "",
    job_title: "",
    company_name: "",
    industry: "",
    email_id: "",
    phone_number: "",
    website: "",
    linkedin_page_link: "",
    employee_size: "",
    company_turn_over: "",
    status: "",
    image: null,
    new_image: null,
  });

  useEffect(() => {
    axios.get(`/api/attendees/${user_id}`).then((res) => {
      if (res.data.status === 200) {
        setEventId(res.data.data.event_id);
        setFormInput(res.data.data);
        setOrginalEventId(res.data.event_id);
      } else if (res.data.status === 400) {
        swal("Error", res.data.message, "error");
        history.push("/admin/all-attendees");
      }
    });
  }, [user_id]);

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

      case "phone_number":
        if (value !== "") {
          if (!/^\d{10}$/.test(value)) {
            fieldErrors[name] = "Invalid phone number. Must be 10 digits.";
          }
        }
        break;

      case "alternate_mobile_number":
        if (value !== "") {
          if (!/^\d{10}$/.test(value)) {
            fieldErrors[name] = "Invalid Alt phone number. Must be 10 digits.";
          }
        }
        break;

      case "job_title":
        if (value === "") {
          fieldErrors[name] = "Job Title is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "company_name":
        if (value === "") {
          fieldErrors[name] = "Company Name is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "industry":
        if (value === "") {
          fieldErrors[name] = "Industry is required.";
        } else if (value.length > 30) {
          fieldErrors[name] = "Maximum 30 Characters Allowed.";
        }
        break;

      case "website":
        if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed in website.";
        }
        break;

      case "employee_size":
        if (value !== "") {
          if (value.length > 8) {
            fieldErrors[name] = "At Most 8 Digits only";
          }
        }
        break;

      case "status":
        if (value === "") {
          fieldErrors[name] = "Status is required";
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

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormInput((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    e.target.classList.remove("is-invalid");
  };

  const handleFileChange = (e) => {
    // setFile(event.target.files[0]);
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
      formInput.email_id === "" ||
      /^\s*$/.test(formInput.email_id) ||
      formInput.email_id.length === 0
    ) {
      fieldErrors.email_id = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formInput.email_id)) {
      fieldErrors.email_id = "Invalid email format.";
    } else if (formInput.email_id > 100) {
      fieldErrors.email_id = "Maximum 100 Characters Allowed.";
    }

    if (formInput.phone_number != "" && formInput.phone_number != null) {
      if (
        /^\s*$/.test(formInput.phone_number) ||
        !/^\d{10}$/.test(formInput.phone_number)
      ) {
        fieldErrors.phone_number = "Invalid phone number. Must be 10 digits.";
      }
    }

    if (
      formInput.alternate_mobile_number === "" &&
      !/^\s*$/.test(formInput.alternate_mobile_number) &&
      !/^\d{10}$/.test(formInput.alternate_mobile_number)
    ) {
      if (
        /^\s*$/.test(formInput.alternate_mobile_number) ||
        !/^\d{10}$/.test(formInput.alternate_mobile_number)
      ) {
        fieldErrors.alternate_mobile_number =
          "Invalid Alternate phone number. Must be 10 digits.";
      }
    }
    if (formInput.alternate_mobile_number !== "") {
      if (formInput.alternate_mobile_number === formInput.phone_number) {
        fieldErrors.alternate_mobile_number =
          "Alt. phone number should be different from Phone Number.";
      }
    }

    if (formInput.job_title === "" || /^\s*$/.test(formInput.job_title)) {
      fieldErrors.job_title = "Job Title is required.";
    } else if (formInput.job_title > 100) {
      fieldErrors.job_title = "Maximum 100 Characters Allowed.";
    }

    if (
      formInput.company_name === "" ||
      /^\s*$/.test(formInput.company_name) ||
      formInput.company_name.length === 0
    ) {
      fieldErrors.company_name = "Company Name is required.";
    } else if (formInput.company_name > 50) {
      fieldErrors.company_name = "Maximum 50 Characters Allowed.";
    }

    if (
      formInput.industry === "" ||
      /^\s*$/.test(formInput.industry) ||
      formInput.industry.length === 0
    ) {
      fieldErrors.industry = "Industry is required.";
    }

    if (formInput.new_image !== "") {
      const allowedFormats = ["image/jpeg", "image/png"];
      if (formInput.new_image) {
        if (!allowedFormats.includes(formInput.new_image.type)) {
          fieldErrors.new_image =
            "Invalid file format. Only JPEG and  PNG formats are allowed.";
        }
      }
    }

    if (formInput.website !== "" && formInput.website !== null) {
      if (formInput.website.length > 100) {
        fieldErrors.website = "Maximum 100 Characters Allowed in website.";
      }
    }

    if (formInput.status === "") {
      fieldErrors.status = "Status is required.";
    }

    let image = {};

    if (formInput.new_image !== "") {
      image = formInput.new_image;
    } else {
      image = formInput.image;
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("image", image);
      formData.append("event_id", formInput.event_id);
      formData.append("first_name", formInput.first_name);
      formData.append("last_name", formInput.last_name);
      formData.append("job_title", formInput.job_title);
      formData.append("company_name", formInput.company_name);
      formData.append("industry", formInput.industry);
      formData.append("email_id", formInput.email_id);
      formData.append("phone_number", formInput.phone_number);
      formData.append(
        "alternate_mobile_number",
        formInput.alternate_mobile_number
      );
      formData.append("website", formInput.website);
      formData.append("linkedin_page_link", formInput.linkedin_page_link);
      formData.append("employee_size", formInput.employee_size);
      formData.append("company_turn_over", formInput.company_turn_over);
      formData.append("status", formInput.status);
      formData.append("_method", "PUT");

      axios
        .post(`/api/attendees/${user_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setFormInput({
              ...formInput,
              event_id: "",
              first_name: "",
              last_name: "",
              job_title: "",
              company_name: "",
              industry: "",
              email_id: "",
              phone_number: "",
              alternate_mobile_number: "",
              website: "",
              linkedin_page_link: "",
              employee_size: "",
              company_turn_over: "",
              status: "",
            });

            setErrors({});

            history.push(`/admin/all-attendee/${orginalEventId}`);
          } else if (res.data.status === 422) {
            // console.log("success", res.data.errors);
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            swal("All fields are mandatory", "", "error");
            history.push(`/admin/all-attendee/${eventId}`);
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
            <h1 className="h3 mb-0 text-gray-800">Edit Attendee </h1>
            <Link
              to={`/admin/all-attendee/${orginalEventId}`}
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
            <h6 className="m-0 font-weight-bold text-primary">Edit Attendee</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                <h5 className="text-center">Edit Attendee Details</h5>
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
                    <label forhtml="email" className="col-12 col-lg-2 col-form-label">
                      Email
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="email"
                          className={`form-control ${
                            errors.email_id ? "is-invalid" : ""
                          }`}
                          placeholder="Email"
                          name="email_id"
                          value={formInput.email_id}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.email_id && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.email_id}
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
                      Phone Number
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.phone_number ? "is-invalid" : ""
                          }`}
                          placeholder="Phone Number"
                          name="phone_number"
                          maxLength={10}
                          value={
                            formInput.phone_number === null
                              ? ""
                              : formInput.phone_number
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.phone_number && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.phone_number}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.alternate_mobile_number ? "is-invalid" : ""
                          }`}
                          placeholder="Alternate Phone Number"
                          name="alternate_mobile_number"
                          maxLength={10}
                          value={
                            formInput.alternate_mobile_number === null
                              ? ""
                              : formInput.alternate_mobile_number
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.alternate_mobile_number && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.alternate_mobile_number}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* File - Event Image  */}
                  <div className="form-group row">
                    <label forhtml="file" className="col-12 col-lg-2 col-form-label">
                      Profile Picture
                    </label>
                    <div className="col-12 col-lg-5">
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

                      {errors.image && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.image}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-lg-4 mt-3">
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

                  {/* Job Title  */}
                  <div className="form-group row">
                    <label forhtml="job_title" className="col-12 col-lg-2 col-form-label">
                      Job Title
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="job_title"
                          className={`form-control ${
                            errors.job_title ? "is-invalid" : ""
                          }`}
                          placeholder="Job Title"
                          name="job_title"
                          value={formInput.job_title}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.job_title && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.job_title}
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
                      Company Name
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="company_name"
                          className={`form-control ${
                            errors.company_name ? "is-invalid" : ""
                          }`}
                          placeholder="Company Name"
                          name="company_name"
                          value={formInput.company_name}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.company_name && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.company_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="form-group row">
                    <label forhtml="industry" className="col-12 col-lg-2 col-form-label">
                      Industry
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="industry"
                          className={`form-control ${
                            errors.industry ? "is-invalid" : ""
                          }`}
                          placeholder="Industry"
                          name="industry"
                          value={formInput.industry}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.industry && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.industry}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event Venue  */}
                  <div className="form-group row">
                    <label forhtml="website" className="col-12 col-lg-2 col-form-label">
                      Website
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="website"
                          className={`form-control ${
                            errors.website ? "is-invalid" : ""
                          }`}
                          placeholder="Website"
                          name="website"
                          value={
                            formInput.website === null ? "" : formInput.website
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.website && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.website}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* profile  */}
                  <div className="form-group row">
                    <label
                      forhtml="linkedin_page_link"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      LinkedIn Profile Link
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="linkedin_page_link"
                          className={`form-control ${
                            errors.linkedin_page_link ? "is-invalid" : ""
                          }`}
                          placeholder="Linked Profile Link"
                          name="linkedin_page_link"
                          value={
                            formInput.linkedin_page_link === null
                              ? ""
                              : formInput.linkedin_page_link
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.linkedin_page_link && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.linkedin_page_link}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Profile Link */}
                  <div className="form-group row">
                    <label
                      forhtml="company_size"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Employee Size
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.employee_size ? "is-invalid" : ""
                          }`}
                          placeholder="Company Size"
                          name="employee_size"
                          maxLength={8}
                          value={
                            formInput.employee_size === null
                              ? ""
                              : formInput.employee_size
                          }
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.employee_size && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.employee_size}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      forhtml="company_turn_over"
                      className="col-12 col-lg-2 col-form-label"
                    >
                      Company Turn Over
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="company_turn_over"
                          className={`form-control ${
                            errors.company_turn_over ? "is-invalid" : ""
                          }`}
                          placeholder="Company Turn Over"
                          name="company_turn_over"
                          value={
                            formInput.company_turn_over === null
                              ? ""
                              : formInput.company_turn_over
                          }
                          maxLength={20}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.company_turn_over && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.company_turn_over}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label forhtml="status" className="col-12 col-lg-2 col-form-label">
                      Attendee Status
                    </label>
                    <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                      <div className="form-group">
                        <select
                          className={`form-control ${
                            errors.status ? "is-invalid" : ""
                          }`}
                          placeholder=""
                          name="status"
                          value={formInput.status}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        >
                          <option value="">Select an Option</option>
                          <option value="speaker">Speaker</option>
                          <option value="panelist">Panellist</option>
                          <option value="sponsor">Sponsor</option>
                          <option value="delegate">Delegate</option>
                          <option value="moderator">Moderator</option>
                        </select>
                        {errors.status && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.status}
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

export default EditAttendee;
