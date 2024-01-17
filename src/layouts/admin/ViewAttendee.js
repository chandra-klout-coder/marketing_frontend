import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
// import Banner from "../../assets/images/event_1879044253.jpg";
// import QrCode from "../../assets/images/Qr.png";
// import { format } from "date-fns";
import swal from "sweetalert";
import Defaultuser from "../../assets/images/defaultuser.png";

function ViewAttendee() {
  // const history = useHistory();

  //Attendee ID
  const id = useParams().id;

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);

  const [eventId, setEventId] = useState(null);
  
  // const [eventdate, setEventDate] = useState({});

  useEffect(() => {
    axios.get(`/api/attendees/${id}`).then((res) => {
      if (res.data.status === 200) {
        setUser(res.data.data);
        setEventId(res.data.event_id);
      } else if (res.data.status === 400) {
        swal("Warning", res.data.message, "warning");
        // history.push("admin/all-attendee");
      }
    });
  }, [id]);

  const capitalizeWord = (str) => {
    // return str.charAt(0).toUpperCase() + str.slice(1);
    return str;
  };

  if (!user) {
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
            <h1 className="h3 mb-0 text-gray-800">Attendee Details</h1>
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
              <i class="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4 p-4">
            <div className="row">
              <div
                className="col-12 col-lg-4 right-border"
                // style={{ borderRight: "2px solid #dbdbdb" }}
              >
                <div className="image-container p-4">
                  {user.image ? (
                    <img
                      src={imageBaseUrl + user.image}
                      width="200"
                      alt={user.image}
                      style={{ borderRadius: "14px" }}
                    />
                  ) : (
                    <img
                      src={Defaultuser}
                      width="200"
                      alt={"default-user"}
                      style={{ borderRadius: "14px" }}
                    />
                  )}
                </div>
              </div>

              <div
                className="col-12 col-md-12 col-lg-4 user-container p-4 right-border"
                // style={{ borderRight: "2px solid #dbdbdb" }}
              >
                <p>
                  <b>Name : </b>
                  {capitalizeWord(user.first_name)}{" "}
                  {capitalizeWord(user.last_name)}
                </p>
                <p>
                  <b> Email ID : </b> {user.email_id}
                </p>
                <p>
                  <b> Phone No : </b>
                  {user.phone_number}
                </p>

                <p>
                  <b> Alternate Phone No : </b>
                  {user.alternate_mobile_number}
                </p>

                <p>
                  <b> Attendee-Status : </b>
                  {capitalizeWord(user.status)}
                </p>

                <p>
                  <b>LinkedIn Profile Link: </b>
                </p>
                <p>
                  {user.linkedin_page_link &&
                    user.linkedin_page_link !== "null" && (
                      <a
                        href={user.linkedin_page_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.linkedin_page_link}
                      </a>
                    )}
                </p>
              </div>

              <div className="col-12 col-md-12 col-lg-4 p-4">
                <p>
                  <b>Job Title : </b>
                  {user.job_title}
                </p>

                <p>
                  <b>Company Name : </b>
                  {capitalizeWord(user.company_name)}
                </p>

                <p>
                  <b> Industry : </b>
                  {capitalizeWord(user.industry)}
                </p>

                <p>
                  <b> Website : </b>
                  {user.website && user.website !== "null" && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.website}
                    </a>
                  )}
                </p>

                <p>
                  <b>Employee Size: </b>
                  {user.employee_size}
                </p>

                <p>
                  <b>Company Turn Over : </b>
                  {user.company_turn_over}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewAttendee;
