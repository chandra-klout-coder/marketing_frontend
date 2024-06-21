import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Defaultuser from "../../assets/images/defaultuser.png";

import { useSelector } from "react-redux";

function ViewMember() {
  const userId = useParams().id;

  const token = useSelector((state) => state.auth.token);

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`/user/${userId}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        if (res.data.status === true) {
          setUser(res.data.result.user);
        }
      });
  }, [userId, token]);

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
            <h1 className="h3 mb-0 text-gray-800">Member Details</h1>
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
              <i class="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4 p-4">
            <div className="row">
              <div className="col-12 col-md-12 col-lg-4 user-container p-4 right-border">
                <p>
                  <b>Name : </b>
                  {user.first_name} {user.last_name}
                </p>
                <p>
                  <b> Email ID : </b> {user.emailId}
                </p>
                <p>
                  <b> Mobile No : </b>
                  {user.mobileNumber}
                </p>

                <p>
                  <b>Designation: </b>
                  {user.designation}
                </p>

                <p>
                  <b>Company: </b>
                  {user.company}
                </p>

                <p>
                  <b>Role: </b>
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewMember;
