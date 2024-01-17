import React, { useEffect, useState, useHistory } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Banner from "../../assets/images/event_1879044253.jpg";
import QrCode from "../../assets/images/Qr.png";
import { format } from "date-fns";
import swal from "sweetalert";
// import Organizer from "../../assets/images/klout logo-02.png";

function SendMailAttendee() {
  const downloadExcelSheet = () => {
    // Create sample Excel sheet data
    const data = [
      [
        "first_name",
        "last_name",
        "job_title",
        "company_name",
        "industry",
        "email",
        "phone_number",
        "website",
        "linkedin_page_link",
        "employee_size",
        "company_turn_over",
        "status",
      ],
      [
        "John",
        "Doe",
        "CEO",
        "Digimantra",
        "IT",
        "johndoe@example.com",
        "8709289369",
        "www.digimantra.com",
        "https://linkedin/company/digimantra",
        "200",
        "5M",
        "Speaker",
      ],
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    // Create a virtual anchor element and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "attendee_list_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //   const history = useHistory();

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [picture, setPicture] = useState([]);

  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

  const [eventInput, setEventInput] = useState({
    title: "",
    description: "",
    start_time: "1",
    start_minute_time: "30",
    start_time_type: "am",
    end_time: "1",
    end_minute_time: "30",
    end_time_type: "pm",
    event_date: "",
    event_venue_name: "",
    event_venue_address_1: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const handleInput = (e) => {
    e.persist();
    setEventInput({ ...eventInput, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setPicture({ image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("image", picture.image);
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
    formData.append("event_venue_address_1", eventInput.event_venue_address_1);
    formData.append("event_venue_address_2", eventInput.event_venue_address_1);
    formData.append("location", eventInput.city);
    formData.append("city", eventInput.city);
    formData.append("state", eventInput.state);
    formData.append("country", eventInput.country);
    formData.append("pincode", eventInput.pincode);
    formData.append("event_date", eventInput.event_date);

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
            start_time: "1",
            start_minute_time: "30",
            start_time_type: "am",
            end_time: "1",
            end_minute_time: "30",
            end_time_type: "pm",
            event_date: "",
            event_venue_name: "",
            event_venue_address_1: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
          });
          setErrors({});

          //   history.push("/admin/all-events");
        } else if (res.data.status === 422) {
          setErrors(res.data.errors);
        } else if (res.data.status === 400) {
          swal("All fields are mandatory", "", "error");
          //   history.push("/admin/all-events");
        }
      });
  };

  const handleFileUpload = (e) => {};

  return (
    <>
      <div className="row p-3">
        <div class="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Send Email to Attendee
              </h6>
            </div>
            <div className="card-body">
              <h5 className="text-center">Send Email</h5>
              <hr />
              <form
                className="user mt-5"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <div classNameName="form-group row">
                  {errors.error && <p classNameName="error">{errors.error}</p>}
                  {success && <p classNameName="success">{success}</p>}
                </div>

                {/* Send Message To*/}
                <div className="form-group row">
                  <label forHtml="email" className="col-12 col-lg-4 col-form-label">
                    Send Message To
                  </label>

                  <div className="col-10 mb-3 mb-sm-0">
                    <div className="form-group mt-2">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox1"
                          value="option1"
                          checked
                        />
                        <label class="form-check-label" for="inlineCheckbox1">
                          All
                        </label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox2"
                          value="option2"
                        />
                        <label class="form-check-label" for="inlineCheckbox2">
                          Speaker
                        </label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox3"
                          value="option3"
                        />
                        <label class="form-check-label" for="inlineCheckbox3">
                          Delegate
                        </label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox3"
                          value="option3"
                        />
                        <label class="form-check-label" for="inlineCheckbox3">
                          Guests
                        </label>
                      </div>

                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox3"
                          value="option3"
                        />
                        <label class="form-check-label" for="inlineCheckbox3">
                          Sponsor
                        </label>
                      </div>

                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox3"
                          value="option3"
                        />
                        <label class="form-check-label" for="inlineCheckbox3">
                          Moderator
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Send  */}
                <div className="form-group row">
                  <label forHtml="email" className="col-12 col-lg-4 col-form-label">
                    Send
                  </label>

                  <div className="col-12 col-lg-8 mb-3 mb-sm-0">
                    <div className="form-group mt-2">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="inlineCheckbox3"
                          value="option3"
                          checked
                        />
                        <label class="form-check-label" for="inlineCheckbox3">
                          Send
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Venue  */}
                <div className="form-group row">
                  <label forHtml="email" className="col-12 col-form-label">
                    Email Body
                  </label>
                  <div className="col-12 col-lg-8 mb-3 mb-sm-0">
                    <div className="form-group">
                      <textarea
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Type Your Content Here..."
                        name="email"
                        value={eventInput.email}
                        onChange={handleInput}
                        rows="12"
                      ></textarea>
                      <span style={{ fontSize: "10px", float: "right" }}>
                        Maximum 5000 Characters limit.
                      </span>
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

               {/* Event date */}
               <div className="form-group row">
                  <h6 className="col-12">Schedule</h6>
                </div>
                <div className="form-group row">
                  <label forHtml="venue" className="col-12 col-form-label">
                    Start Date
                  </label>

                  <div className="col-6 col-lg-3 mb-3 mb-sm-0">
                    <div className="form-group">
                      <input
                        type="date"
                        className={`form-control ${
                          errors.event_date ? "is-invalid" : ""
                        }`}
                        name="event_date"
                        min={currentDate}
                        value={eventInput.event_date}
                        onChange={handleInput}
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

                  <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                    <div className="form-group">
                      {/* <select
                      type="time"
                      className={`form-control ${
                        errors.start_time ? "is-invalid" : ""
                      }`}
                      name="start_time"
                      value={eventInput.start_time}
                      onChange={handleInput}
                    >

                      {timeDropDown.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.id}
                          </option>
                        );
                      })}
                    </select> */}
                      <label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          className={`form-control ${
                            errors.start_time ? "is-invalid" : ""
                          }`}
                          name="start_time"
                          placeholder="Hour"
                          value={eventInput.start_time}
                          onChange={handleInput}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                    <div className="form-group">
                      <label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          className={`form-control ${
                            errors.start_minute_time ? "is-invalid" : ""
                          }`}
                          name="start_minute_time"
                          placeholder="Minute"
                          value={eventInput.start_minute_time}
                          onChange={handleInput}
                        />
                      </label>

                      {/* {errors.start_time && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.start_time}
                      </div>
                    )} */}
                    </div>
                  </div>

                  <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                    <div className="form-group">
                      <div
                        className="form-check form-check-inline"
                        style={{ padding: "10px" }}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="start_time_type"
                          value="am"
                          checked={eventInput.start_time_type === "am"}
                          onChange={handleInput}
                        />
                        <label
                          className="form-check-label"
                          forHtml="inlineRadio1"
                        >
                          AM
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="start_time_type"
                          value="pm"
                          checked={eventInput.start_time_type === "pm"}
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
                <div className="form-group row">
                  <label forHtml="venue" className="col-12 col-form-label">
                    End Date
                  </label>

                  <div className="col-6 col-lg-3 mb-3 mb-sm-0">
                    <div className="form-group">
                      <input
                        type="date"
                        className={`form-control ${
                          errors.event_date ? "is-invalid" : ""
                        }`}
                        name="event_date"
                        min={currentDate}
                        value={eventInput.event_date}
                        onChange={handleInput}
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

                  <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                    <div className="form-group">
                      {/* <select
                      type="time"
                      className={`form-control ${
                        errors.start_time ? "is-invalid" : ""
                      }`}
                      name="start_time"
                      value={eventInput.start_time}
                      onChange={handleInput}
                    >

                      {timeDropDown.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.id}
                          </option>
                        );
                      })}
                    </select> */}
                      <label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          className={`form-control ${
                            errors.start_time ? "is-invalid" : ""
                          }`}
                          name="start_time"
                          placeholder="Hour"
                          value={eventInput.start_time}
                          onChange={handleInput}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="col-3 col-lg-2 mb-3 mb-sm-0">
                    <div className="form-group">
                      <label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          className={`form-control ${
                            errors.start_minute_time ? "is-invalid" : ""
                          }`}
                          name="start_minute_time"
                          placeholder="Minute"
                          value={eventInput.start_minute_time}
                          onChange={handleInput}
                        />
                      </label>

                      {/* {errors.start_time && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                        }}
                      >
                        {errors.start_time}
                      </div>
                    )} */}
                    </div>
                  </div>

                  <div className="col-12 col-lg-5 mb-3 mb-sm-0">
                    <div className="form-group">
                      <div
                        className="form-check form-check-inline"
                        style={{ padding: "10px" }}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="start_time_type"
                          value="am"
                          checked={eventInput.start_time_type === "am"}
                          onChange={handleInput}
                        />
                        <label
                          className="form-check-label"
                          forHtml="inlineRadio1"
                        >
                          AM
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="start_time_type"
                          value="pm"
                          checked={eventInput.start_time_type === "pm"}
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

                <div className="form-group row">
                  <label forHtml="venue" className="col-12 col-form-label">
                    The SMS should be sent
                  </label>

                  <div className="col-3 col-lg-1 mb-3 mb-sm-0">
                    <div className="form-group">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        className={`form-control ${
                          errors.start_time ? "is-invalid" : ""
                        }`}
                        name="start_time"
                        placeholder="Hour"
                        value={eventInput.start_time}
                        onChange={handleInput}
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

                  <label forHtml="venue" className="col-3 col-form-label">
                    time every
                  </label>

                  <div className="col-3 col-lg-1 mb-3 mb-sm-0">
                    <div className="form-group">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        className={`form-control ${
                          errors.start_time ? "is-invalid" : ""
                        }`}
                        name="start_time"
                        placeholder="Hour"
                        value={eventInput.start_time}
                        onChange={handleInput}
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

                  <label forHtml="venue" className="col-3 col-form-label">
                    Hours.
                  </label>
                </div>

                <div className="form-group row">
                  <label
                    forHtml="status"
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
                    >
                      Submit
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

export default SendMailAttendee;
