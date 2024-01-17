import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import styled from "styled-components";

import * as XLSX from "xlsx";

function AllFeedbacks(props) {
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);

  const [search, setSearch] = useState("");

  const [eventFilter, setEventFilter] = useState("");

  const [firstNameFilter, setFirstNameFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    axios.get("/api/feedbacks").then((res) => {
      if (res.data.status == 200) {
        setFeedbacks(res.data.data);
        setFilteredFeedbacks(res.data.data);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Apply filters whenever name, email, or phoneFilter changes
    const filtered = feedbacks.filter((feedback) => {
      const eventMatch = feedback.eventTitle
        .toLowerCase()
        .includes(eventFilter.toLowerCase());

      const firstnameMatch = feedback.first_name
        .toLowerCase()
        .includes(firstNameFilter.toLowerCase());

      return firstnameMatch && eventMatch; // && phoneMatch  emailMatch  &&
    });

    // Apply search filter
    const searchFiltered = filtered.filter((attendee) =>
      attendee.first_name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredFeedbacks(searchFiltered);
  }, [firstNameFilter, eventFilter, search, feedbacks]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const paginatedData = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    // Convert attendee data to Excel worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredFeedbacks);

    // Create a workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedbacks");

    // Export the workbook to Excel file
    XLSX.writeFile(workbook, "User_Filter_List.xlsx");
  };

  const capitalizeWord = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  let FeedbackList = "";

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
    FeedbackList = paginatedData.map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          {/* <td>{capitalizeWord(item.eventId)}</td> */}
          <td>{capitalizeWord(item.eventTitle)}</td>
          <td>{capitalizeWord(item.first_name)}</td>
          <td>{capitalizeWord(item.last_name)}</td>
          <td>{capitalizeWord(item.subject)}</td>
          <td>{item.message}</td>
          <td>{item.rating}</td>
          
          <td>
            {/* <Link
                to={`add-attendee/${item.id}`}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Add Attendees"
                className="btn btn-sm btn-secondary btn-circle"
                style={{ borderRadius: "50%" }}
              >
                <i className="fas fa-user"></i>
              </Link> */}
            {/* <Link
              to={`/admin/view-attendee-details/${item.id}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="View Attendee Detail"
              className="btn btn-sm btn-info btn-circle"
              style={{ borderRadius: "50%", color: "#fff" }}
            >
              <i className="fas fa-eye"></i>
            </Link>
            &nbsp; &nbsp;
            <Link
              to={`/admin/edit-attendee/${item.id}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Edit Attendee"
              className="btn btn-sm btn-primary btn-circle"
              style={{ borderRadius: "50%" }}
            >
              <i className="fas fa-edit"></i>
            </Link>
            &nbsp; &nbsp;
            <button
              data-toggle="tooltip"
              data-placement="bottom"
              title="Delete Attendee"
              className="btn btn-sm btn-danger btn-circle"
              onClick={(e) => deleteAttendee(e, item.id)}
              style={{ borderRadius: "50%" }}
            >
              <i className="fas fa-trash"></i>
            </button> */}
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">All Feedbacks</h1>
        {/* <a
            href="#"
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          >
            <i className="fas fa-download fa-sm text-white-50"></i> Generate Report
          </a> */}
        {/* 
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
            <i className="fa fa-plus fa-sm"></i> Create New Event
          </Link> */}

        <div className="d-none d-sm-inline-block shadow-sm">
          <Link
            to={`/admin/dashboard`}
            className="btn btn-sm btn-primary shadow-sm"
            style={{
              backgroundColor: "#F5007E",
              borderColor: "#F5007E",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <i className="fa fa-solid fa-arrow-left"></i>&nbsp; Go To Dashboard
          </Link>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Feedbacks</h6>
          </div>
          <div className="card-body">
            <div className="row pb-4">
              <div className="col-8 col-lg-4">
                {/* Event filter input */}
                <input
                  type="text"
                  placeholder="Filter by Event"
                  value={eventFilter}
                  className="form-control"
                  onChange={(e) => setEventFilter(e.target.value)}
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
                  className="btn btn-success float-right"
                >
                  <i className="fa fa-solid fa-download"></i> Export to Excel
                </button>
              </div> */}
            </div>

            <div className="table-responsive">
              <table className="table table-hover" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Feedback-ID</th>
                    <th>Event</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Rating</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>

                <tbody>
                  {FeedbackList.length > 0 ? (
                    FeedbackList
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={7}>No Data Found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <nav aria-label="Page navigation comments" className="mt-4">
                {filteredFeedbacks.length > 0 && (
                  <ReactPaginate
                    previousLabel="<< Previous"
                    nextLabel="Next >>"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(
                      filteredFeedbacks.length / itemsPerPage
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
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllFeedbacks;
