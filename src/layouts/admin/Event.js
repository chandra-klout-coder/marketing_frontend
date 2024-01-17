import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";
import loadingGif from "../../assets/images/load.gif";

function Event() {
  const history = useHistory();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Get current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split("T")[0];

  //Dropdown for Time (Minute)- 00 to 60
  const minuteOptions = Array.from({ length: 61 }, (_, index) => {
    const value = index < 10 ? `0${index}` : `${index}`;
    return (
      <option key={value} value={value}>
        {value}
      </option>
    );
  });

  //Dropdown for Time (Hour)- 00 to 12
  const hourOptions = Array.from({ length: 12 }, (_, index) => {
    const value = (index + 1).toString().padStart(2, "0");
    return (
      <option key={value} value={value}>
        {value}
      </option>
    );
  });

  const [eventInput, setEventInput] = useState({
    title: "",
    description: "",
    event_start_date: "",
    event_end_date: "",
    start_time: "09",
    start_minute_time: "30",
    start_time_type: "am",
    end_time: "06",
    end_minute_time: "30",
    end_time_type: "pm",
    event_venue_name: "",
    event_venue_address_1: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    image: null,
    feedback: "1",
    status: "1",
  });

  const handleInput = (e) => {
    e.persist();
    const { name, value } = e.target;
    setEventInput({ ...eventInput, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    const currentDate = new Date();

    switch (name) {
      case "title":
        if (value === "") {
          fieldErrors[name] = "Title is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "description":
        if (value === "") {
          fieldErrors[name] = "Description is required.";
        } else if (value.length > 3000) {
          fieldErrors[name] = "Maximum 3000 Characters Allowed.";
        }
        break;
      case "event_venue_name":
        if (value === "") {
          fieldErrors[name] = "Venue Details is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "event_venue_address_1":
        if (value === "") {
          fieldErrors[name] = "Address is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "city":
        if (value === "") {
          fieldErrors[name] = "City is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "state":
        if (value === "") {
          fieldErrors[name] = "State is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "country":
        if (value === "") {
          fieldErrors[name] = "State is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "pincode":
        if (value === "") {
          fieldErrors[name] = "Pincode is required.";
        } else if (!/^\d{6}$/.test(value)) {
          fieldErrors[name] = "Invalid Pin Code. Must be 6 digits.";
        }
        break;

      case "event_start_date":
        if (value === "") {
          fieldErrors[name] = "Start Date is required.";
        } else if (value < currentDate) {
          fieldErrors[name] = "Start Date is Invalid";
        }
        break;

      case "event_end_date":
        if (value === "") {
          fieldErrors[name] = "End Date is required.";
        } else if (value < currentDate) {
          fieldErrors[name] = "End Date is Invalid";
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
    setEventInput((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    e.target.classList.remove("is-invalid");
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }

    setEventInput((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldErrors = {};

    if (
      eventInput.title === "" ||
      /^\s*$/.test(eventInput.title) ||
      eventInput.title.length === 0
    ) {
      fieldErrors.title = "Title is required.";
    } else if (eventInput.title.length > 100) {
      fieldErrors.title = "Maximum 100 Characters Allowed.";
    }

    if (
      eventInput.description === "" ||
      /^\s*$/.test(eventInput.description) ||
      eventInput.description.length === 0
    ) {
      fieldErrors.description = "Description is required.";
    } else if (eventInput.description.length > 3000) {
      fieldErrors.description = "Maximum 3000 Characters Allowed.";
    }

    if (!eventInput.image) {
      fieldErrors.image = "Event Banner is required.";
    } else {
      const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedFormats.includes(eventInput.image.type)) {
        fieldErrors.image =
          "Invalid file format. Only JPEG & PNG formats are allowed.";
      }
    }

    if (
      eventInput.event_venue_name === "" ||
      /^\s*$/.test(eventInput.event_venue_name) ||
      eventInput.event_venue_name.length === 0
    ) {
      fieldErrors.event_venue_name = "Event Venue Details is required.";
    } else if (eventInput.event_venue_name.length > 50) {
      fieldErrors.event_venue_name = "Maximum 50 Characters Allowed.";
    }

    if (
      eventInput.event_venue_address_1 === "" ||
      /^\s*$/.test(eventInput.event_venue_address_1) ||
      eventInput.event_venue_address_1.length === 0
    ) {
      fieldErrors.event_venue_address_1 = "Addess is required.";
    } else if (eventInput.event_venue_address_1.length > 100) {
      fieldErrors.event_venue_address_1 = "Maximum 100 Characters Allowed.";
    }

    if (
      eventInput.city === "" ||
      /^\s*$/.test(eventInput.city) ||
      eventInput.city.length === 0
    ) {
      fieldErrors.city = "City is required.";
    } else if (eventInput.city.length > 50) {
      fieldErrors.city = "Maximum 50 Characters Allowed.";
    }

    if (
      eventInput.state === "" ||
      /^\s*$/.test(eventInput.state) ||
      eventInput.state.length === 0
    ) {
      fieldErrors.state = "State is required.";
    } else if (eventInput.state.length > 50) {
      fieldErrors.state = "Maximum 50 Characters Allowed.";
    }

    if (
      eventInput.country === "" ||
      /^\s*$/.test(eventInput.country) ||
      eventInput.country.length === 0
    ) {
      fieldErrors.country = "Country is required.";
    } else if (eventInput.country.length > 50) {
      fieldErrors.country = "Maximum 50 Characters Allowed.";
    }

    if (
      eventInput.pincode === "" ||
      /^\s*$/.test(eventInput.pincode) ||
      eventInput.pincode.length === 0
    ) {
      fieldErrors.pincode = "Pin Code is required.";
    } else if (!/^\d{6}$/.test(eventInput.pincode)) {
      fieldErrors.pincode = "Invalid Pin Code. Must be 6 digits.";
    }

    if (
      eventInput.event_start_date === "" ||
      eventInput.event_start_date === 0
    ) {
      fieldErrors.event_start_date = "Start Date is required.";
    } else if (eventInput.event_start_date < currentDate) {
      fieldErrors.event_start_date = "Start Date is Invalid";
    } else if (
      eventInput.event_start_date !== "" &&
      eventInput.event_start_date > eventInput.event_end_date
    ) {
      fieldErrors.event_start_date = "Start Date is Invalid";
    }

    if (eventInput.event_end_date === "" || eventInput.event_start_date === 0) {
      fieldErrors.event_end_date = "End Date is required.";
    } else if (eventInput.event_end_date < currentDate) {
      fieldErrors.event_end_date = "End Date is Invalid";
    } else if (
      eventInput.event_end_date !== "" &&
      eventInput.event_end_date < eventInput.event_start_date
    ) {
      fieldErrors.event_end_date = "End Date is Invalid";
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("image", eventInput.image);
      formData.append("title", eventInput.title);
      formData.append("description", eventInput.description);
      formData.append("start_time", eventInput.start_time);
      formData.append("start_time_type", eventInput.start_time_type);
      formData.append("start_minute_time", eventInput.start_minute_time);
      formData.append("end_time", eventInput.end_time);
      formData.append("end_time_type", eventInput.end_time_type);
      formData.append("end_minute_time", eventInput.end_minute_time);
      formData.append("event_venue", eventInput.event_venue_name);
      formData.append("event_venue_name", eventInput.event_venue_name);
      formData.append(
        "event_venue_address_1",
        eventInput.event_venue_address_1
      );
      formData.append(
        "event_venue_address_2",
        eventInput.event_venue_address_1
      );
      formData.append("location", eventInput.city);
      formData.append("city", eventInput.city);
      formData.append("state", eventInput.state);
      formData.append("country", eventInput.country);
      formData.append("pincode", eventInput.pincode);
      formData.append("event_date", eventInput.event_start_date);
      formData.append("event_start_date", eventInput.event_start_date);
      formData.append("event_end_date", eventInput.event_end_date);
      formData.append("feedback", eventInput.feedback);
      formData.append("status", eventInput.status);

      axios
        .post(`/api/events`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setEventInput({
              ...eventInput,
              title: "",
              description: "",
              event_start_date: "",
              event_end_date: "",
              start_time: "09",
              start_minute_time: "30",
              start_time_type: "am",
              end_time: "06",
              end_minute_time: "30",
              end_time_type: "pm",
              event_venue_name: "",
              event_venue_address_1: "",
              city: "",
              state: "",
              country: "",
              pincode: "",
            });

            setErrors({});

            history.push("/admin/all-events");
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            swal("All fields are mandatory", res.data.message, "error");
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
            <h1 className="h3 mb-0 text-gray-800"> Add Event </h1>
           
            <Link
              to={`/admin/all-events`}
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
            <h6 className="m-0 font-weight-bold text-primary">Add Event</h6>
          </div>
          <div className="card-body">
            <form
              className="user mt-5"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Title */}
              <div className="form-group row">
                <label forHtml="title" className="col-12 col-lg-2 col-form-label">
                  Event Title
                </label>
                <div className="col-10">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    placeholder="Title"
                    name="title"
                    value={eventInput.title}
                    onChange={handleInput}
                    onBlur={handleBlur}
                    onFocus={handleInputFocus}
                  />
                  <p style={{ fontSize: "12px", float: "right" }}>
                    * Maximum 100 Characters Allowed.
                  </p>

                  {errors.title && (
                    <div
                      className="invalid-feedback"
                      style={{
                        textAlign: "left",
                      }}
                    >
                      {errors.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Description  */}
              <div className="form-group row">
                <label forHtml="description" className="col-12 col-lg-2 col-form-label">
                  Event Description
                </label>
                <div className="col-10">
                  <textarea
                    type="textarea"
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    placeholder="Description"
                    name="description"
                    value={eventInput.description}
                    onChange={handleInput}
                    onBlur={handleBlur}
                    onFocus={handleInputFocus}
                    rows="6"
                  ></textarea>
                  <p style={{ fontSize: "12px", float: "right" }}>
                    * Maximum 3000 Characters Allowed.
                  </p>

                  {errors.description && (
                    <div
                      className="invalid-feedback"
                      style={{
                        textAlign: "left",
                      }}
                    >
                      {errors.description}
                    </div>
                  )}
                </div>
              </div>

              {/* File - Event Image  */}
              <div className="form-group row">
                <label forHtml="file" className="col-12 col-lg-2 col-form-label">
                  Upload Event Image
                </label>
                <div className="col-10">
                  <input
                    type="file"
                    className={`form-control ${
                      errors.image ? "is-invalid" : ""
                    }`}
                    name="file"
                    onChange={handleImage}
                    onBlur={handleBlur}
                    onFocus={handleInputFocus}
                  />
                  <p style={{ fontSize: "12px", float: "right" }}>
                    * Upload Event Banner in JPG and PNG Format Only.
                  </p>

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

                <div className="col-4">
                  {eventInput.image && (
                    <img
                      src={selectedImage}
                      width="100%"
                      alt={eventInput.image}
                      style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                  )}
                </div>
              </div>

              {/* Event Venue  */}

              <div className="form-group row">
                <label forHtml="venue" className="col-12 col-lg-2 col-form-label">
                  Event Venue
                </label>

                <div className="col-10 mb-3 mb-sm-0">
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.event_venue_name ? "is-invalid" : ""
                      }`}
                      placeholder="Venue Details"
                      name="event_venue_name"
                      value={eventInput.event_venue_name}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                    />

                    {errors.event_venue_name && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.event_venue_name}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.event_venue_address_1 ? "is-invalid" : ""
                      }`}
                      placeholder="Address"
                      name="event_venue_address_1"
                      value={eventInput.event_venue_address_1}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                    />

                    {errors.event_venue_address_1 && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.event_venue_address_1}
                      </div>
                    )}
                  </div>

                  <div className="form-group row">
                    <div className="col-6 col-lg-3 mb-3">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.city ? "is-invalid" : ""
                        }`}
                        placeholder="City"
                        name="city"
                        value={eventInput.city}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.city && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.city}
                        </div>
                      )}
                    </div>

                    <div className="col-6 col-lg-3 mb-3">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.state ? "is-invalid" : ""
                        }`}
                        placeholder="State"
                        name="state"
                        value={eventInput.state}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.state && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.state}
                        </div>
                      )}
                    </div>

                    <div className="col-6 col-lg-3">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.country ? "is-invalid" : ""
                        }`}
                        placeholder="Country"
                        name="country"
                        value={eventInput.country}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.country && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.country}
                        </div>
                      )}
                    </div>

                    <div className="col-6 col-lg-3">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.pincode ? "is-invalid" : ""
                        }`}
                        placeholder="Pincode"
                        name="pincode"
                        value={eventInput.pincode}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        maxLength={6}
                        onFocus={handleInputFocus}
                      />

                      {errors.pincode && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.pincode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Start date */}
              <div className="form-group row">
                <label forHtml="venue" className="col-12 col-lg-2 col-form-label">
                  Event Start Date
                </label>

                <div className="col-10 mb-3 mb-sm-0">
                  <div className="form-group">
                    <input
                      type="date"
                      className={`form-control ${
                        errors.event_start_date ? "is-invalid" : ""
                      }`}
                      name="event_start_date"
                      min={currentDate}
                      value={eventInput.event_start_date}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    />

                    {errors.event_start_date && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.event_start_date}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event End date */}
              <div className="form-group row">
                <label forHtml="venue" className="col-12 col-lg-2 col-form-label">
                  Event End Date
                </label>

                <div className="col-10 mb-3 mb-sm-0">
                  <div className="form-group">
                    <input
                      type="date"
                      className={`form-control ${
                        errors.event_end_date ? "is-invalid" : ""
                      }`}
                      name="event_end_date"
                      min={currentDate}
                      value={eventInput.event_end_date}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    />

                    {errors.event_end_date && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.event_end_date}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Start Time */}
              <div className="form-group row">
                <label forHtml="venue" className="col-12 col-lg-2 col-form-label">
                  Event Start Time
                </label>

                <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <select
                      className={`form-control ${
                        errors.start_time ? "is-invalid" : ""
                      }`}
                      name="start_time"
                      placeholder="Hour"
                      value={eventInput.start_time}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    >
                      {hourOptions}
                    </select>
                  </div>
                </div>

                <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <select
                      className={`form-control ${
                        errors.start_minute_time ? "is-invalid" : ""
                      }`}
                      name="start_minute_time"
                      placeholder="Minute"
                      value={eventInput.start_minute_time}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    >
                      {minuteOptions}
                    </select>
                  </div>
                </div>

                <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                  <div className="form-group d-inline-flex">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input mx-1"
                        type="radio"
                        name="start_time_type"
                        value="am"
                        checked={eventInput.start_time_type === "am"}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio1"
                      >
                        AM
                      </label>
                    </div>
                    <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="start_time_type"
                        value="pm"
                        checked={eventInput.start_time_type === "pm"}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio2"
                      >
                        PM
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Start Time */}
              <div className="form-group row">
                <label forHtml="venue" className="col-12 col-lg-2 col-form-label">
                  Event End Time
                </label>

                <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <select
                      className={`form-control ${
                        errors.end_minute_time ? "is-invalid" : ""
                      }`}
                      name="end_time"
                      placeholder="Hour"
                      value={eventInput.end_time}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    >
                      {hourOptions}
                    </select>
                  </div>
                </div>

                <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                  <div className="form-group">
                    <select
                      className={`form-control ${
                        errors.end_minute_time ? "is-invalid" : ""
                      }`}
                      name="end_minute_time"
                      placeholder="Minute"
                      value={eventInput.end_minute_time}
                      onChange={handleInput}
                      onFocus={handleInputFocus}
                    >
                      {minuteOptions}
                    </select>
                  </div>
                </div>

                <div className="col-12 col-lg-4 mb-3 mb-sm-0">
                  <div className="form-group d-inline-flex">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input mx-1"
                        type="radio"
                        name="end_time_type"
                        value="am"
                        checked={eventInput.end_time_type === "am"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio1"
                      >
                        AM
                      </label>
                    </div>
                    <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="end_time_type"
                        value="pm"
                        checked={eventInput.end_time_type === "pm"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio2"
                      >
                        PM
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="form-group row">
                <label forHtml="venue" className="col-12 col-lg-2 col-form-label">
                  Feedback Required ?
                </label>

                <div className="col-4 mb-3 mb-sm-0">
                  <div className="form-group d-inline-flex">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input mx-1"
                        type="radio"
                        name="feedback"
                        value="1"
                        checked={eventInput.feedback === "1"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio1"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="feedback"
                        value="0"
                        checked={eventInput.feedback === "0"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio2"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              {/* <div className="form-group row">
                <label forHtml="venue" className="col-12 col-lg-2 col-form-label">
                  Status
                </label>

                <div className="col-4 mb-3 mb-sm-0">
                  <div className="form-group d-inline-flex">
                    <div
                      className="form-check form-check-inline d-flex align-items-center justify-content-center"
                      // style={{ padding: "10px" }}
                    >
                      <input
                        className="form-check-input mx-1"
                        type="radio"
                        name="status"
                        value="0"
                        checked={eventInput.status === "0"}
                        onChange={handleInput}
                      />
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio1"
                      >
                        Pending
                      </label>
                    </div>
                    <div className="form-check form-check-inline d-flex align-items-center justify-content-center">
                      <span>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        value="1"
                        checked={eventInput.status === "1"}
                        onChange={handleInput}
                      />
                      </span>
                      <span>
                      <label
                        className="form-check-label"
                        forHtml="inlineRadio2"
                      >
                        Activate
                      </label>
                      </span>
                    </div>
                  </div>
                </div>
              </div> */}

              <button
                className="btn btn-primary btn-user"
                style={{
                  backgroundColor: "#F5007E",
                  borderColor: "#F5007E",
                  fontSize: "14px",
                  padding: "1% 6%",
                  width: "50%",
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
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Event;
