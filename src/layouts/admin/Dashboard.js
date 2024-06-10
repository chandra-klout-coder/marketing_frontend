import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./EventCard.css";
import { useSelector } from "react-redux";

function Dashboard() {
  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const token = useSelector((state) => state.auth.token);
  const userId = localStorage.getItem("userId");

  const [totalCredits, setTotalCredits] = useState(0);
  const [totalCreditUsed, setTotalCreditUsed] = useState(0);
  const [totalCreditRemain, setTotalCreditRemain] = useState(0);

  useEffect(() => {
    axios
      .post(
        "/user/getUserPoints",
        { userId },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((response) => {
        setTotalCredits(
          response.data.result.userPoints.allocatedPoints.toLocaleString()
        );
        setTotalCreditUsed(
          response.data.result.userPoints.usedPoints.toLocaleString()
        );
        setTotalCreditRemain(
          response.data.result.userPoints.remainPoints.toLocaleString()
        );
      })
      .catch((error) => {
        console.error("Error fetching event count:", error);
      });
  }, [token, userId]);

  return (
    <>
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">Usage Analytics</h1>
        <Link
          to="/admin/buy-credits"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          style={{
            backgroundColor: "#F5007E",
            borderColor: "#F5007E",
            color: "white",
            borderRadius: "12px",
          }}
        >
          <i className="fa fa-plus fa-sm mx-1"></i>
          Buy Credits
        </Link>
      </div>

      {/* <!-- Content Row --> */}
      <div className="row m-3">
        {/* <!-- Total Events --> */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div
            className="card border-left-primary shadow h-100 py-2"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 0px 25px #0000001A",
              borderRadius: "20px",
              opacity: "1",
            }}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center p-2">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold mb-1 ">
                    <h6>Total Credits</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    {totalCredits}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Total Attendees --> */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div
            className="card border-left-success shadow h-100 py-2"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 0px 25px #0000001A",
              borderRadius: "20px",
              opacity: "1",
            }}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center p-2">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold mb-1 ">
                    <h6>Total Credits Used</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    {totalCreditUsed}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Total Sponsors --> */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div
            className="card border-left-warning shadow h-100 py-2"
            style={{
              background: "#FFFFFF 0% 0% no-repeat padding-box",
              boxShadow: "0px 0px 25px #0000001A",
              borderRadius: "20px",
              opacity: "1",
            }}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center p-2">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold mb-1 ">
                    <h6>Total Credits Remain</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    {totalCreditRemain}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fa fa-solid fa-user-secret fa-2x text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">Credit</h1>
        {/* <Link
          to="/admin/add-event"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          style={{
            backgroundColor: "#F5007E",
            borderColor: "#F5007E",
            color: "white",
            borderRadius: "12px",
          }}
        >
          <i className="fa fa-plus fa-sm mx-1"></i> Create New Event
        </Link> */}
      </div>
      <div className="row p-3">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Credit Details
                <Link
                  to="/admin/buy-credits"
                  className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  style={{
                    backgroundColor: "#F5007E",
                    borderColor: "#F5007E",
                    color: "white",
                    borderRadius: "12px",
                    float: "right",
                  }}
                >
                  Buy Credits
                </Link>
              </h6>
            </div>

            <div className="card-body">
              <div className="row pb-4"></div>

              <div className="table-responsive">
                <table
                  className="table table-hover"
                  width="100%"
                  cellspacing="0"
                >
                  <thead>
                    <tr>
                      <th className="text-center">Transaction ID </th>
                      <th className="text-center">Date & Time</th>
                      <th className="text-center">Credit Bought</th>
                      <th className="text-center">Credit Used</th>
                      <th className="text-center">Credit Left</th>
                      <th className="text-center">Valid Till</th>

                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  {/* <tbody>{AttendeeList}</tbody> */}
                  <tbody>
                    {/* {AttendeeList.length > 0 ? (
                    AttendeeList
                  ) : ( */}
                    <tr>
                      <td className="text-center">108</td>
                      <td className="text-center">03 June 2024 02:00 PM</td>
                      <td className="text-center">1000</td>
                      <td className="text-center">900</td>
                      <td className="text-center">100</td>
                      <td className="text-center">03 August 2024 02:00 PM</td>
                    </tr>
                    {/* )} */}
                  </tbody>
                </table>

                {/* Pagination */}
                <nav aria-label="Page navigation comments" className="mt-4">
                  {/* {filteredAttendees.length > 0 && (
                  <ReactPaginate
                    previousLabel="<< Previous"
                    nextLabel="Next >>"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(
                      filteredAttendees.length / itemsPerPage
                    )}
                    onPageChange={({ selected }) =>
                      handlePageChange(selected + 1)
                    }
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                  />
                )} */}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /.container-fluid --> */}
      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">Plans</h1>
        {/* <Link
          to="/admin/add-event"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          style={{
            backgroundColor: "#F5007E",
            borderColor: "#F5007E",
            color: "white",
            borderRadius: "12px",
          }}
        >
          <i className="fa fa-plus fa-sm mx-1"></i> Create New Event
        </Link> */}
      </div>
      <div className="row p-3">
        <div className="col-md-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Invoice History
              </h6>
            </div>

            <div className="card-body">
              <div className="row pb-4">
                <div className="col-6 col-lg-3">
                  {/* Event filter input */}
                  <input
                    type="text"
                    placeholder="Filter by Invoice"
                    // value={eventFilter}
                    className="form-control"
                    // onChange={(e) => setEventFilter(e.target.value)}
                  />
                </div>

                {/* Name filter input */}
                {/* <div className="col-2">
                <input
                  type="text"
                  placeholder="Filter by Name"
                  value={firstNameFilter}
                  className="form-control"
                  onChange={(e) => setFirstNameFilter(e.target.value)}
                />
              </div> */}

                {/* Email filter input */}
                {/* <div className="col-2">
                <input
                  type="text"
                  placeholder="Filter by Email"
                  value={emailIDFilter}
                  className="form-control"
                  onChange={(e) => setEmailIDFilter(e.target.value)}
                />
              </div> */}

                {/* Phone filter input */}
                {/* <div className="col-2">
                <input
                  type="text"
                  placeholder="Filter by Phone"
                  value={phoneFilter}
                  className="form-control"
                  onChange={(e) => setPhoneFilter(e.target.value)}
                />
              </div> */}

                {/* <div className="col-2">
                  {/* Search input */}
                {/* <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    className="form-control"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div> */}

                {/* <div className="col-3 ">
                <button
                  onClick={exportToExcel}
                  class="btn btn-success float-right"
                >
                  <i class="fa fa-solid fa-download"></i> Export to Excel
                </button>
              </div> */}
              </div>

              <div className="table-responsive">
                <table
                  className="table table-hover"
                  width="100%"
                  cellspacing="0"
                >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date </th>
                      <th>Amount</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  {/* <tbody>{AttendeeList}</tbody> */}
                  <tbody>
                    {/* {AttendeeList.length > 0 ? (
                    AttendeeList
                  ) : ( */}
                    <tr>
                      <td className="text-center" colSpan={4}>
                        No Invoices
                      </td>
                    </tr>
                    {/* )} */}
                  </tbody>
                </table>

                {/* Pagination */}
                <nav aria-label="Page navigation comments" className="mt-4">
                  {/* {filteredAttendees.length > 0 && (
                  <ReactPaginate
                    previousLabel="<< Previous"
                    nextLabel="Next >>"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(
                      filteredAttendees.length / itemsPerPage
                    )}
                    onPageChange={({ selected }) =>
                      handlePageChange(selected + 1)
                    }
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                  />
                )} */}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                  Subscription
                </h6>
                <Link
                  to="/admin/add-event"
                  className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                  style={{
                    backgroundColor: "#F5007E",
                    borderColor: "#F5007E",
                    color: "white",
                    borderRadius: "12px",
                  }}
                >
                  Change Plan
                </Link>
              </div>
            </div>

            <div className="card-body">
              <div className="row pb-4"></div>

              <div className="table-responsive">
                <table
                  className="table table-hover"
                  width="100%"
                  cellspacing="0"
                >
                  <thead>
                    <tr>
                      <td>Plan</td>
                      <td>Free Monthly</td>
                    </tr>
                    <tr>
                      <td>Credits </td>
                      <td> 5 credits per month </td>
                    </tr>
                    <tr>
                      <td>Users</td>
                      <td>1</td>
                    </tr>

                    <tr>
                      <td colSpan={2}>
                        Your Credits will be renewed on March 29th, 2024
                      </td>
                    </tr>
                  </thead>
                </table>

                {/* Pagination */}
                <nav aria-label="Page navigation comments" className="mt-4">
                  {/* {filteredAttendees.length > 0 && (
                  <ReactPaginate
                    previousLabel="<< Previous"
                    nextLabel="Next >>"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(
                      filteredAttendees.length / itemsPerPage
                    )}
                    onPageChange={({ selected }) =>
                      handlePageChange(selected + 1)
                    }
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                  />
                )} */}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
