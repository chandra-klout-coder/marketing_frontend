import React, { useEffect, useState } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

import QrCode from "../../assets/images/Qr.png";
import { format } from "date-fns";
import DefaultBanner from "../../assets/images/default-banner.jpg";

function SendSmsAttendee(props) {
  const history = useHistory();

  const eventId = props.match.params.id;

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

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

  //12 Hours Interval till 96 hours
  const intervals = Array.from({ length: 8 }, (_, index) => (index + 1) * 12);

  const [formInput, setFormInput] = useState({
    event_id: eventId,
    send_to: null,
    send_method: "email",
    subject: "",
    message: "",
    start_date: "",
    start_date_time: "01",
    start_date_type: "am",
    end_date: "",
    end_date_time: "01",
    end_date_type: "pm",
    no_of_times: "1",
    hour_interval: "12",
    status: 1,
  });

  const roles = ["All", "Speaker", "Delegate", "Sponsor", "Moderator"];

  const [selectedRoles, setSelectedRoles] = useState(["All"]);

  const [event, setEvent] = useState({});
  const [showAlert, setShowAlert] = useState(true);

  const [showInput, setShowInput] = useState(true);

  const handleRoleChange = (event) => {
    const value = event.target.value;

    if (value === "All") {
      setSelectedRoles(["All"]); // Selecting "All" will deselect other roles
    } else {
      const updatedRoles = selectedRoles.includes("All")
        ? [value]
        : selectedRoles.includes(value)
        ? selectedRoles.filter((role) => role !== value)
        : [...selectedRoles, value];

      setSelectedRoles(updatedRoles);
      setFormInput({ ...formInput, send_to: updatedRoles });
    }
  };

  useEffect(() => {

    setFormInput({ ...formInput, send_to: selectedRoles });

    axios.get(`/api/events/${eventId}`).then((res) => {
      if (res.data.status === 200) {
        setEvent(res.data.data);
      } else if (res.data.status === 400) {
        swal("Error", res.data.message, "error");
        history.push("/admin/all-events");
      }
    });
  }, [history, eventId]);

  const handleSendMethodChange = (event) => {
    if (event.target.value === "email") {
      setErrors({ message: "" });
      setShowInput(true);
    } else {
      setShowInput(false);
    }

    setFormInput({ ...formInput, send_method: event.target.value });
  };

  const handleInput = (e) => {
    e.persist();
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    const currentDate = new Date();

    switch (name) {
      case "subject":
        if (value === "") {
          fieldErrors[name] = "Subject is required.";
        } else if (value.length > 500) {
          fieldErrors[name] = "Maximum 500 Characters Allowed.";
        }
        break;

      case "message":
        if (value === "") {
          fieldErrors[name] = "Message is required.";
        }
        break;

      case "start_date":
        if (value === "") {
          fieldErrors[name] = "Start Date is required.";
        } else if (value > event.event_start_date) {
          fieldErrors[name] = "Start Date should not greater Event Start Date.";
        }
        break;

      case "end_date":
        if (value === "") {
          fieldErrors[name] = "End Date is required.";
        } else if (value > event.event_end_date) {
          fieldErrors[name] = "End Date should not greater Event End Date.";
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

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldErrors = {};

    if (formInput.send_to.length === 0) {
      fieldErrors.send_to = "Roles is required.";
    }

    if (
      formInput.subject === "" &&
      /^\s*$/.test(formInput.subject) &&
      formInput.subject.length === 0
    ) {
      fieldErrors.subject = "Subject is required.";
    } else if (formInput.subject.length > 100) {
      fieldErrors.subject = "Maximum 100 Characters Allowed.";
    }

    if (
      formInput.message === "" ||
      /^\s*$/.test(formInput.message) ||
      formInput.message.length === 0
    ) {
      fieldErrors.message = "Message is required.";
    } else if (formInput.send_method === "email") {
      if (formInput.message.length > 500) {
        fieldErrors.message = "Maximum 500 Characters Allowed.";
      }
    } else if (formInput.send_method !== "email") {
      if (formInput.message.length > 150) {
        fieldErrors.message = "Maximum 150 Characters Allowed.";
      }
    }

    if (formInput.start_date === "" || formInput.start_date === 0) {
      fieldErrors.start_date = "Start Date is required.";
    } else if (formInput.start_date > event.event_start_date) {
      fieldErrors.start_date =
        "Start Date should not greater Event Start Date.";
    } else if (
      formInput.start_date !== "" &&
      formInput.start_date > formInput.end_date
    ) {
      fieldErrors.start_date = "Start Date is Invalid";
    }

    if (formInput.end_date === "" || formInput.end_date === 0) {
      fieldErrors.end_date = "End Date is required.";
    } else if (formInput.end_date > event.event_end_date) {
      fieldErrors.end_date = "End Date should not greater Event End Date.";
    } else if (
      formInput.end_date !== "" &&
      formInput.end_date > formInput.end_date
    ) {
      fieldErrors.end_date = "Start Date is Invalid";
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("event_id", formInput.event_id);
      formData.append("send_to", formInput.send_to);
      formData.append("subject", formInput.subject);
      formData.append("send_method", formInput.send_method);
      formData.append("message", formInput.message);
      formData.append("start_date", formInput.start_date);
      formData.append("start_date_time", formInput.start_date_time);
      formData.append("start_date_type", formInput.start_date_type);
      formData.append("end_date", formInput.end_date);
      formData.append("end_date_time", formInput.end_date_time);
      formData.append("end_date_type", formInput.end_date_type);
      formData.append("no_of_times", formInput.no_of_times);
      formData.append("hour_interval", formInput.hour_interval);


      console.log('sdfss',formInput);

      axios
        .post(`/api/notifications`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {

          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setErrors({});

            history.push(`/admin/all-attendee/${eventId}`);
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            setShowAlert(true);
            setErrors({ error: res.data.message });
          } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
            history.push("login");
          }
        });
    } else {
      setErrors(fieldErrors);
    }

    setIsLoading(false);

    // axios
    //   .post(`/api/events`, formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   })
    //   .then((res) => {
    //     if (res.data.status === 200) {
    //       swal("Success", res.data.message, "success");

    //       setEventInput({
    //         ...formInput,
    //         title: "",
    //         description: "",
    //         start_time: "1",
    //         start_minute_time: "30",
    //         start_time_type: "am",
    //         end_time: "1",
    //         end_minute_time: "30",
    //         end_time_type: "pm",
    //         event_date: "",
    //         event_venue_name: "",
    //         event_venue_address_1: "",
    //         city: "",
    //         state: "",
    //         country: "",
    //         pincode: "",
    //       });
    //       setErrors({});

    //       //   history.push("/admin/all-events");
    //     } else if (res.data.status === 422) {
    //       setErrors(res.data.errors);
    //     } else if (res.data.status === 400) {
    //       swal("All fields are mandatory", "", "error");
    //       //   history.push("/admin/all-events");
    //     }
    //   });
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
            <h1 className="h3 mb-0 text-gray-800">Send SMS to Attendee </h1>
            <Link
              to={`/admin/all-attendee/${eventId}`}
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
        <div className="col-12 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Send SMS to Attendee for {event.title}
              </h6>
            </div>
            <div className="card-body">
              <h5 className="text-center">Send SMS to Attendee</h5>
              <hr />
              <form
                className="user mt-5"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                {errors.error && showAlert && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {errors.error}
                    <br />

                    <button className="close" onClick={closeAlert}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )}

                {/* Send Message To*/}
                <div className="form-group row">
                  <label forhtml="email" className="col-12 col-lg-3 col-form-label">
                    Select Roles
                  </label>

                  <div className="col-9 mt-2">
                    <div className="form-group">
                      {roles.map((role) => (
                        <div
                          className="form-check form-check-inline"
                          key={role}
                        >
                          <input
                            type="checkbox"
                            id={role}
                            name={role}
                            value={role}
                            checked={selectedRoles.includes(role)}
                            onChange={handleRoleChange}
                          />
                          <label className="form-check-label" forhtml={role}>
                            &nbsp; {role}
                          </label>
                        </div>
                      ))}

                      {errors.send_to && (
                        <div
                          className="invalid-feedback"
                          style={{
                            display: errors.send_to ? "block" : "none",
                            textAlign: "left",
                          }}
                        >
                          {errors.send_to}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Send Method */}
                <div className="form-group row">
                  <label forhtml="email" className="col-12 col-lg-3 col-form-label">
                    Send
                  </label>

                  <div className="col-9 mb-3 mb-sm-0">
                    <div className="form-group mt-2">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="send_method"
                          value="email"
                          checked={formInput.send_method === "email"}
                          onChange={handleSendMethodChange}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineCheckbox3"
                        >
                          Email
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="send_method"
                          value="sms"
                          checked={formInput.send_method === "sms"}
                          onChange={handleSendMethodChange}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineCheckbox1"
                        >
                          SMS
                        </label>
                      </div>
                      <div className="form-check form-check-inline my-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="send_method"
                          value="whatsapp"
                          checked={formInput.send_method === "whatsapp"}
                          onChange={handleSendMethodChange}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineCheckbox2"
                        >
                          WhatsApp
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                {showInput && (
                  <div className="form-group row">
                    <label forhtml="email" className="col-12 col-lg-3 col-form-label">
                      Subject
                    </label>

                    <div className="col-9 mb-2 mb-sm-0">
                      <div className="form-group">
                        <input
                          className={`form-control ${
                            errors.subject ? "is-invalid" : ""
                          }`}
                          type="text"
                          name="subject"
                          placeholder="Subject"
                          value={formInput.subject}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />
                        {errors.subject && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.subject}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Venue  */}
                <div className="form-group row">
                  <label forhtml="email" className="col-12 col-lg-3 col-form-label">
                    Message
                  </label>
                  <div className="col-9 mb-3 mb-sm-0">
                    <div className="form-group">
                      <textarea
                        className={`form-control ${
                          errors.message ? "is-invalid" : ""
                        }`}
                        placeholder="Message"
                        name="message"
                        value={formInput.message}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                        rows={showInput ? "10" : "5"}
                      ></textarea>
                      <span style={{ fontSize: "10px", float: "right" }}>
                        Maximum {showInput ? "500" : "150"} Characters limit.
                      </span>
                      {errors.message && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event date */}
                <div className="form-group row">
                  <h6 className="text-title">
                    {" "}
                    <b>Schedule Date & Time </b>


                  </h6>
                </div>

                <div className="form-group row">
                  <label forhtml="venue" className="col-12 col-lg-4 col-form-label">
                    Start Date
                  </label>

                  <div className="col-5 col-lg-5 mb-3 mb-sm-0">
                    <div className="form-group">
                      <input
                        type="date"
                        className={`form-control ${
                          errors.start_date ? "is-invalid" : ""
                        }`}
                        name="start_date"
                        min={currentDate}
                        value={formInput.start_date}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.start_date && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.start_date}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-3 col-lg-3 mb-3 mb-sm-0">
                    <div className="form-group">
                      <select
                        className={`form-control ${
                          errors.start_time ? "is-invalid" : ""
                        }`}
                        name="start_date_time"
                        placeholder="Hour"
                        value={formInput.start_date_time}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                        onBlur={handleBlur}
                      >
                        {hourOptions}
                      </select>
                      {errors.start_date_time && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.start_date_time}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-lg-5 mb-3 mb-sm-0 px-4">
                    <div className="form-group">
                      <div
                        className="form-check form-check-inline mx-3" 
                        style={{ padding: "10px" }}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="start_date_type"
                          value="am"
                          checked={
                            formInput.start_date_type === "am" ||
                            formInput.start_date_type === "AM"
                          }
                          onChange={handleInput}
                          onFocus={handleInputFocus}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineRadio1"
                        >
                          AM
                        </label>
                      </div>

                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="start_date_type"
                          value="pm"
                          checked={
                            formInput.start_date_type === "pm" ||
                            formInput.start_date_type === "PM"
                          }
                          onChange={handleInput}
                          onFocus={handleInputFocus}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineRadio2"
                        >
                          PM
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label forhtml="" className="col-12 col-lg-4 col-form-label">
                    End Date
                  </label>

                  <div className="col-5 col-lg-5 mb-3 mb-sm-0">
                    <div className="form-group">
                      <input
                        type="date"
                        className={`form-control ${
                          errors.end_date ? "is-invalid" : ""
                        }`}
                        name="end_date"
                        min={currentDate}
                        value={formInput.end_date}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.end_date && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.end_date}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-3 col-lg-3 mb-3 mb-sm-0">
                    <div className="form-group">
                      <select
                        className={`form-control ${
                          errors.end_date_time ? "is-invalid" : ""
                        }`}
                        name="end_date_time"
                        placeholder="Hour"
                        value={formInput.end_date_time}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                        onBlur={handleBlur}
                      >
                        {hourOptions}
                      </select>

                      {errors.end_date_time && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.end_date_time}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-lg-5 mb-3 mb-sm-0 px-4">
                    <div className="form-group">
                      <div
                        className="form-check form-check-inline mx-3"
                        style={{ padding: "10px" }}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="end_date_type"
                          value="am"
                          checked={
                            formInput.end_date_type === "am" ||
                            formInput.end_date_type === "AM"
                          }
                          onChange={handleInput}
                          onFocus={handleInputFocus}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineRadio1"
                        >
                          AM
                        </label>
                      </div>

                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="end_date_type"
                          value="pm"
                          checked={
                            formInput.end_date_type === "pm" ||
                            formInput.end_date_type === "PM"
                          }
                          onChange={handleInput}
                          onFocus={handleInputFocus}
                        />
                        <label
                          className="form-check-label"
                          forhtml="inlineRadio2"
                        >
                          PM
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label forhtml="venue" className="col-12 col-lg-12 col-form-label mb-3">
                    The SMS should be sent
                  </label>

                  <div className="col-3 col-lg-3 mb-3 mb-sm-0">
                    <div className="form-group">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        className={`form-control ${
                          errors.no_of_times ? "is-invalid" : ""
                        }`}
                        name="no_of_times"
                        placeholder="Hour"
                        value={formInput.no_of_times}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                        readOnly
                      />

                      {errors.no_of_times && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.no_of_times}
                        </div>
                      )}
                    </div>
                  </div>

                  <label forhtml="venue" className="col-3 col-lg-3 col-form-label">
                    Time Every
                  </label>

                  <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                    <div className="form-group">
                      <select
                        className={`form-control ${
                          errors.hour_interval ? "is-invalid" : ""
                        }`}
                        name="hour_interval"
                        value={formInput.hour_interval}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                      >
                        {intervals.map((interval) => (
                          <option key={interval} value={interval}>
                            {interval}
                          </option>
                        ))}
                      </select>

                      {errors.hour_interval && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.hour_interval}
                        </div>
                      )}
                    </div>
                  </div>

                  <label forhtml="venue" className="col-3 col-lg-3 col-form-label">
                    Hours.
                  </label>
                </div>

                <div className="form-group row">
                  <div className="col-12 mt-4 mb-4">
                    <button
                      className="btn btn-primary btn-user btn-block"
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
                        "Send Now"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {event && (
          <div className="col-12 col-lg-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Event Details
                </h6>
              </div>
              <div className="row p-4">
                <div
                  className="col-12 col-lg-6"
                  // style={{ borderRight: "2px solid #dbdbdb" }}
                >
                  <div
                    className="image-container mb-2 mt-5"
                    style={{
                      position: "relative",
                      opacity: "1",
                      border: "1px solid #efefef",
                      borderRadius: "20px",
                    }}
                  >
                    {event.image ? (
                      <img
                        src={imageBaseUrl + event.image}
                        width="100%"
                        alt="Image"
                        style={{ borderRadius: "14px", objectFit: "cover" }}
                      />
                    ) : (
                      <img
                        src={DefaultBanner}
                        width="884"
                        alt="Image"
                        style={{ borderRadius: "14px" }}
                      />
                    )}

                    {/* <div
                    className="text-overlay"
                    style={{
                      position: "absolute",
                      bottom: "1%",
                      left: "1%",
                      textAlign: "left",
                      padding: "20px",
                    }}
                  >
                    <h2>{event.title}</h2>
                  
                  </div> */}
                  </div>
                  <div className="text-overlay">
                    <h5>{event.title}</h5>
                  </div>
                </div>

                <div
                  className="col-12 col-lg-6"
                  style={{
                    // padding: "10px",
                  }}
                >
                  <div style={{ padding: "20px" }}>
                    {/* <p> */}
                      <b>Event QR Code</b>
                    {/* </p> */}

                    <div
                      style={{
                        padding: "10px",
                        border: "2px solid #efefef",
                        width: "80%",
                      }}
                    >
                      {event.qr_code ? (
                        <img
                          src={imageBaseUrl + event.qr_code}
                          width="120px"
                          alt="Image"
                        />
                      ) : (
                        <img src={QrCode} alt="banner" width="100%" />
                      )}
                    </div>

                    <span style={{ fontSize: "11px" }}>Scan to Know More</span>
                  </div>
                </div>
              </div>

              <div className="row mt-1">
                <div
                  className="col-12 col-lg-5 pt-1"
                  style={{ padding: "0 2rem" }}
                >
                  <h5>
                    <b>Description</b>
                  </h5>
                  <p>{event.description}</p>
                  {/* 
                <h6 className=""> Location </h6>
                <p>
                  {event.event_venue_name}
                  {", "} {event.venue_address_1}
                  {", "} {event.city}
                  {", "} {event.state}
                  {", "} {event.country}
                  {", "} {event.pincode}
                </p> */}
                </div>

                <div className="col-12 col-lg-7 pt-1 mb-1">
                  <div
                    style={{
                      border: "2px solid #f6f6f6",
                      width: "90%",
                      margin: "auto",
                      backgroundColor: "#f6f6f6",
                      borderradius: "8px",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px",
                      }}
                    >
                      <h6 className="">
                        <b>Date</b>
                      </h6>
                      <p>
                        Start Date - {event.event_start_date}
                        <br />
                        End Date - {event.event_end_date}
                      </p>

                      <h6 className="">
                        <b>Time</b>
                      </h6>

                      <p className="">
                        {" From "} {event.start_time}:{event.start_minute_time}{" "}
                        {event.start_time_type} {" - "}
                        {event.end_time}:{event.end_minute_time}{" "}
                        {event.end_time_type}
                      </p>

                      <h6 className="">
                        <b>Location</b>{" "}
                      </h6>
                      <p>
                        {event.event_venue_name}
                        {", "} {event.event_venue_address_1}
                        {", "} {event.city}
                        {", "} {event.state}
                        {", "} {event.country}
                        {", "} {event.pincode}
                      </p>
                    </div>
                    <hr />
                    <div
                      style={{
                        padding: "10px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SendSmsAttendee;
