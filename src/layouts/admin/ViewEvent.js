import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Banner from "../../assets/images/event_1879044253.jpg";
import QrCode from "../../assets/images/Qr.png";
import { format } from "date-fns";
import DefaultBanner from "../../assets/images/default-banner.jpg";

function ViewEvent() {
  const [id, setId] = useState(useParams().id);
  const [event, setEvent] = useState(null);
  const [attendees, setAddendees] = useState([]);

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`/api/events/${id}`).then((res) => {
      if (res.data.status === 200) {
        // console.log(res.data.data);
        setEvent(res.data.data);

        // setEventDate(format(res.data.data.event_date, 'MMMM d, yyyy'));
      } else if (res.data.status === 400) {
      }
    });

    axios.get(`/api/totalattendees/${id}`).then((res) => {
      if (res.data.status === 200) {
        setAddendees(res.data.data);
      }
    });
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <!-- Page Heading --> */}

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
            <h1 className="h3 mb-0 text-gray-800 ">Event Details</h1>
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
              <i className="fa fa-arrow-left fa-sm"></i> &nbsp; Go back
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4 p-4">
            <div className="row">
              <div className="col-12 col-lg-7">
                <div
                  className="image-container mb-2"
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
                    <>
                      <img
                        src={DefaultBanner}
                        width="884"
                        alt="Image"
                        style={{ borderRadius: "14px" }}
                      />
                    </>
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
                  <h2>{event.title}</h2>
                </div>
              </div>

              <div className="col-12 col-lg-5">
                <div>
                  <b>Event QR Code</b>

                  <div
                    style={{
                      padding: "10px",
                      border: "2px solid #efefef",
                      width: "70%",
                    }}
                  >
                    {event.qr_code ? (
                      <>
                        <img
                          src={imageBaseUrl + event.qr_code}
                          width="70%"
                          alt="Image"
                        />
                        <a
                          className="btn btn-sm btn-info shadow-sm"
                          style={{
                            borderColor: "#0dcaf0",
                            color: "white",
                            borderRadius: "12px",
                          }}
                          href={imageBaseUrl + event.qr_code}
                          download
                        >
                          Click here to download QR Code
                        </a>
                      </>
                    ) : (
                      <>
                        <img src={QrCode} alt="banner" width="100%" />
                        <a
                          className="btn btn-sm btn-info shadow-sm"
                          style={{
                            borderColor: "#0dcaf0",
                            color: "white",
                            borderRadius: "12px",
                          }}
                          href={QrCode}
                          download
                        >
                          Click here to download Demo QR Code
                        </a>
                      </>
                    )}
                  </div>

                  <span style={{ fontSize: "11px" }}>Scan to Know More</span>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12 col-lg-7 pt-4">
                <h5>
                  <b>Description</b>
                </h5>
                <p>{event.description}</p>
              </div>

              <div className="col-12 col-lg-5 pt-4">
                <div
                  style={{
                    border: "2px solid #f6f6f6",
                    width: "100%",
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <div
                    style={{
                      padding: "10px",
                    }}
                  >
                    <h6 class="">
                      <b>Date</b>
                    </h6>
                    <p>
                      Start Date - {event.event_start_date}
                      <br />
                      End Date - {event.event_end_date}
                    </p>

                    <h6 class="">
                      <b>Time</b>
                    </h6>

                    <p class="">
                      {" From "} {event.start_time}:{event.start_minute_time}{" "}
                      {event.start_time_type} {" - "}
                      {event.end_time}:{event.end_minute_time}{" "}
                      {event.end_time_type}
                    </p>

                    <h6 class="">
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

                  {attendees.length > 0 && (
                    <>
                      <hr />

                      <div
                        style={{
                          padding: "10px",
                        }}
                      >
                        <Link
                          to={`/admin/send-notification-attendee/${id}`}
                          className="btn btn-sm btn-info shadow-sm"
                          style={{
                            borderColor: "#0dcaf0",
                            color: "white",
                            borderRadius: "12px",
                          }}
                        >
                          <i class="fa fa-solid fa-paper-plane"></i> &nbsp; Send
                          Invitation Email / SMS
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewEvent;
