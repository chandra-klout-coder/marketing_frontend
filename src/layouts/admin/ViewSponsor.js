import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
// import Banner from "../../assets/images/event_1879044253.jpg";
// import QrCode from "../../assets/images/Qr.png";
// import { format } from "date-fns";
import swal from "sweetalert";
import Defaultuser from "../../assets/images/defaultuser.png";

function ViewSponsor() {
  // const history = useHistory();

  //sponsor - id
  const id = useParams().id;

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/sponsors/${id}`).then((res) => {
      if (res.data.status === 200) {
        setUser(res.data.data);
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
            <h1 className="h3 mb-0 text-gray-800">Sponsor Details</h1>
            <Link
              to={`/admin/sponsors`}
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
                className="col-4 col-lg-4 right-border"
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

              <div className="col-8 col-md-8 col-lg-8">
                <div className="row">
                  <div
                    className="col-6 col-md-6 col-lg-6 user-container p-4"
                    // style={{ borderRight: "2px solid #dbdbdb" }}
                  >
                    <h5>Personal Info : </h5>
                    <hr />
                    <p>
                      <b>Name : </b>
                      {capitalizeWord(user.first_name)}{" "}
                      {capitalizeWord(user.last_name)}
                    </p>
                    <p>
                      <b> Email ID : </b> {user.official_email}
                    </p>
                    <p>
                      <b> Phone No : </b>
                      {user.phone_number}
                    </p>

                    <p>
                      <b> Status : </b>
                      {user.status === 1 ? "Active" : "Inactive"}
                    </p>

                    <p>
                      <b> Job Title : </b>
                      {user.job_title_name }
                    </p>
                  </div>

                  <div className="col-6 col-md-6 col-lg-6 p-4">
                    <h5>Company Info : </h5>
                    <hr />
                    <p>
                      <b>Company: </b>
                      {user.company_name}
                    </p>

                    <p>
                      <b>Brand Name : </b>
                      {capitalizeWord(user.brand_name)}
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
                      <b>LinkedIn Page Link: </b>
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

                    <p>
                      <b>Employee Size: </b>
                      {user.employee_size}
                    </p>
                    {/* 
                    <p>
                      <b>Company Turn Over : </b>
                      {user.company_turn_over}
                    </p> */}
                  </div>
                </div>
                {/* <hr /> */}
                <div className="row" style={{ display: "none" }}>
                  <div
                    className="col-12 col-md-12 col-lg-12 user-container p-4"
                    // style={{ borderRight: "2px solid #dbdbdb" }}
                  >
                    <h5>SponsorShip Details : </h5>
                    <hr />
                    <p>
                      <b>SponsorShip Member Type : </b>{" "}
                      {user.sponsorship_package}
                    </p>
                    <p>
                      <b> Amount : </b> {user.currency} <b>{user.amount}</b>
                    </p>
                    <p>
                      <a
                        className="btn btn-success"
                        href={imageBaseUrl + user.file}
                        download="Contract_document.pdf" // Specify the desired file name for download
                      >
                        {" Download Contract Document "}
                        <i class="fa fa-solid fa-arrow-down"></i>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewSponsor;
