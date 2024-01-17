import React, { useEffect, useState } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

import QrCode from "../../assets/images/Qr.png";
import { format } from "date-fns";
import DefaultBanner from "../../assets/images/default-banner.jpg";

function Reports() {
  const history = useHistory();

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [reportData, setReportData] = useState({});

  const [selectedEvent, setSelectedEvent] = useState("");

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

  const [events, setEvents] = useState([]);

  const [showAlert, setShowAlert] = useState(true);

  const [formInput, setFormInput] = useState({
    event_id: "",
    report_name: "",
    event_date: "",
    event_tags: "all",
    event_attribute: "",
    status: 1,
  });

  useEffect(() => {
    axios.get("/api/totalevents").then((res) => {
      if (res.data.status === 200) {
        const eventData = res.data.data;
        setEvents(eventData);
      }
    });
  }, []);

  const handleInput = (e) => {
    e.persist();
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    const currentDate = new Date();

    switch (name) {
      case "report_name":
        if (value === "") {
          fieldErrors[name] = "Report Name is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "event_id":
        if (value === "") {
          fieldErrors[name] = "Event is required.";
        }
        break;

      case "event_date":
        if (value === "") {
          fieldErrors[name] = "Event Date is required.";
        }
        break;

      case "event_attribute":
        if (value === "") {
          fieldErrors[name] = "Event Attribute is required.";
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

  const downloadReportExcelSheet = (fileName, reportRows) => {
    const data = [
      [
        "event_name",
        "first_name",
        "last_name",
        "image",
        "virtual_business_card",
        "job_title",
        "company_name",
        "industry",
        "email_id",
        "phone_number",
        "website",
        "linkedin_page_link",
        "employee_size",
        "company_turn_over",
        "status",
        "profile_completed",
        "alternate_mobile_number",
      ],
      ...Object.values(reportRows).map((obj) => Object.values(obj)),
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");

    // Create a virtual anchor element and trigger download
    const link = document.createElement("a");

    link.setAttribute("href", encodeURI(csvContent));

    link.setAttribute("download", `${fileName}_${timestamp}.csv`);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    // setTimeout(() => {
    //   window.location.reload();
    // }, 2000);
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

    if (
      formInput.report_name === "" &&
      /^\s*$/.test(formInput.report_name) &&
      formInput.report_name.length === 0
    ) {
      fieldErrors.report_name = "Report Name is required.";
    } else if (formInput.report_name.length > 100) {
      fieldErrors.report_name = "Maximum 100 Characters Allowed.";
    }

    if (formInput.event_id === "" || formInput.event_id === 0) {
      fieldErrors.event_id = "Event is required.";
    }

    if (formInput.event_date === "" || formInput.event_date === 0) {
      fieldErrors.event_date = "Event Date is required.";
    } else if (
      formInput.event_date !== "" &&
      formInput.event_date > formInput.end_date
    ) {
      fieldErrors.event_date = "Event Date is Invalid";
    }

    if (formInput.event_attribute === "" || formInput.event_attribute === 0) {
      fieldErrors.event_attribute = "Event  Attribute is required.";
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("report_name", formInput.report_name);
      formData.append("event_id", formInput.event_id);
      formData.append("event_date", formInput.event_date);
      formData.append("event_attribute", formInput.event_attribute);
      formData.append("event_tags", formInput.event_tags);

      axios
        .post(`/api/event-report`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            setReportData(res.data.data);

            downloadReportExcelSheet(formInput.report_name, res.data.data);

            setErrors({});

            history.push(`/admin/all-reports`);
          } else if (res.data.status === 400) {
            setReportData({});

            setErrors({ event_date: res.data.message });
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
            <h1 className="h3 mb-0 text-gray-800">Event Reports</h1>
            <Link
              to={`/admin/all-reports`}
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
        <div className="col-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Event Reports
              </h6>
            </div>
            <div className="card-body">
              <h5 className="text-center">Event Reports</h5>

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

                {/* Report Name */}
                <div className="form-group row">
                  <label forhtml="report_name" className="col-3 col-form-label">
                    Report Name
                  </label>

                  <div className="col-9 mb-3 mb-sm-0">
                    <div className="form-group">
                      <input
                        className={`form-control ${
                          errors.report_name ? "is-invalid" : ""
                        }`}
                        type="text"
                        name="report_name"
                        placeholder="Report Name"
                        value={formInput.report_name}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                        style={{marginBottom:"0px"}}
                      />

                      {errors.report_name && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.report_name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Name  */}
                <div className="form-group row">
                  <label forhtml="event_id" className="col-3 col-form-label">
                    Select Event
                  </label>
                  <div className="col-9 mb-3 mb-sm-0">
                    <div className="form-group">
                      <select
                        className={`form-control ${
                          errors.event_id ? "is-invalid" : ""
                        }`}
                        name="event_id"
                        value={formInput.event_id}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      >
                        <option value="">Select an Option</option>

                        {events &&
                          events.map((event) => (
                            <option key={event.id} value={event.id}>
                              {event.title} {" ( Date - "}{" "}
                              {event.event_start_date} {" ) "}
                            </option>
                          ))}
                      </select>

                      {errors.event_id && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.event_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Date */}
                <div className="form-group row">
                  <label forhtml="venue" className="col-3 col-form-label">
                    Event Date
                  </label>

                  <div className="col-9 mb-3 mb-sm-0">
                    <div className="form-group">
                      <input
                        type="date"
                        className={`form-control ${
                          errors.event_date ? "is-invalid" : ""
                        }`}
                        name="event_date"
                        value={formInput.event_date}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.event_date && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.event_date}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Tags */}
                <div className="form-group row">
                  <label forhtml="email" className="col-3 col-form-label">
                    Event Tags
                  </label>
                  <div className="col-9 mb-3 mb-sm-0">
                    <div className="col-3 mb-3 mb-sm-0">
                      <div className="form-group">
                        <div
                          className="form-check form-check-inline"
                          style={{ padding: "10px" }}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="event_tags"
                            value="all"
                            checked={formInput.event_tags === "all"}
                            onChange={handleInput}
                            onFocus={handleInputFocus}
                          />
                          <label
                            className="form-check-label"
                            forhtml="inlineRadio1"
                          >
                            All Tags
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Attribute  */}
                <div className="form-group row">
                  <label forhtml="email" className="col-3 col-form-label">
                    Event Attribute
                  </label>
                  <div className="col-9 mb-3 mb-sm-0">
                    <div className="form-group">
                      <select
                        className={`form-control ${
                          errors.event_attribute ? "is-invalid" : ""
                        }`}
                        name="event_attribute"
                        value={formInput.event_attribute}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      >
                        <option value="">Select an Option</option>

                        <option
                          key="attendance_report"
                          value="attendance_report"
                        >
                          Attendance Report (Includes all Event Data)
                        </option>
                        <option
                          key="user_data_uploaded_for_the_event"
                          value="user_data_uploaded_for_the_event"
                        >
                          User Data uploaded for the Event
                        </option>
                      </select>

                      {errors.event_attribute && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.event_attribute}
                        </div>
                      )}
                    </div>
                  </div>
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
                        "Download CSV"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;
