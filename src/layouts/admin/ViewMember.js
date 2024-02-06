import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Defaultuser from "../../assets/images/defaultuser.png";

function ViewMember() {
  // const history = useHistory();

  //Attendee ID
  const id = useParams().id;

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/members/${id}`).then((res) => {
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
                  {capitalizeWord(user.first_name)}{" "}
                  {capitalizeWord(user.last_name)}
                </p>
                <p>
                  <b> Email ID : </b> {user.email}
                </p>
                <p>
                  <b> Mobile No : </b>
                  {user.mobile_number}
                </p>

                <p>
                  <b>Company: </b>
                  {capitalizeWord(user.company)}
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
