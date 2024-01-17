import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./EventCard.css";

function Dashboard() {
  const imageBaseUrl = process.env.REACT_APP_API_URL;

  // const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalSponsors, setTotalSponsors] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);
  // const [upcomingEvents, setUpcomingEvents] = useState(0);
  // const [upcomingEventsData, setUpcomingEventsData] = useState([]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // useEffect(() => {
  //   axios
  //     .get("/api/totalevents")
  //     .then((response) => {
  //       setTotalEvents(response.data.total_events);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching event count:", error);
  //     });

  //   axios
  //     .get("/api/totalattendeesOrganizer")
  //     .then((response) => {
  //       setTotalAttendees(response.data.total_attendees.length);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching attendee count:", error);
  //     });

  //   axios
  //     .get("/api/totalsponsors")
  //     .then((response) => {
  //       setTotalSponsors(response.data.totalsponsors);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching attendee count:", error);
  //     });

  //   axios
  //     .get("/api/upcomingevents")
  //     .then((response) => {
  //       setUpcomingEvents(response.data.upcoming_events);
  //       setUpcomingEventsData(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching attendee count:", error);
  //     });

  //   axios.get("/api/events").then((res) => {
  //     if (res.data.status === 200) {
  //       setEvents(res.data.data);
  //     }
  //   });
  // }, []);

  return (
    <>
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">Usage Analytics</h1>
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
                    <h6>Credits Used</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    7
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
                    <h6>Saved contacts</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    21
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
                    <h6>Collected Details</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    108
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fa fa-solid fa-user-secret fa-2x text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Upcoming Events --> */}
        {/* <div className="col-xl-3 col-md-6 mb-4">
          <div
            className="card border-left-danger shadow h-100 py-2"
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
                    <h6>Upcoming Events</h6>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-1000">
                    {upcomingEvents}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-support fa-table fa-2x text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* <!-- Upcoming Events--> */}
      {/* <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">Upcoming Events</h1>
        {upcomingEventsData.length > 0 && (
          <Link
            to="/admin/all-events"
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
            style={{
              backgroundColor: "#F5007E",
              borderColor: "#F5007E",
              color: "white",
              borderRadius: "12px",
            }}
          >
            View All Upcoming Events <i className="fa fa-arrow-right mx-1"></i>
          </Link>
        )}
      </div> */}

      {/* <div className="row m-3"> */}
      {/* <!-- Area Chart --> */}
      {/* {upcomingEventsData.length > 0 ? (
          <div className="col-12">
            <div>
              <Slider {...settings}>
                {upcomingEventsData.map((item) => (
                  <div className="card event-card" key={item.id}>
                    <img
                      className="event-image"
                      src={imageBaseUrl + item.image}
                      alt={item.title}
                      style={{
                        borderRadius: "20px",
                        objectFit: "cover",
                        padding: "10px 8px",
                        width: "100%",
                      }}
                    />

                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.event_date}</p>
                      <p className="card-text">{item.location}</p>
                      <Link
                        to={`view-event/${item.id}`}
                        className="btn btn-primary"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ) : (
          <div className="card event-card p-3 text-center">No Data Found</div>
        )}
      </div> */}

      {/* <!-- All Events--> */}
      {/* <div className="d-sm-flex d-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">All Events</h1>
        {events.length > 0 && (
          <Link
            to="/admin/all-events"
            className="d-sm-inline-block btn btn-sm btn-primary shadow-sm"
            style={{
              backgroundColor: "rgb(220 210 68)",
              borderColor: "rgb(220 210 68)",
              color: "white",
              borderRadius: "12px",
            }}
          >
            View All Events <i className="fa fa-arrow-right"></i>
          </Link>
        )}
      </div> */}

      {/* <div className="row m-3"> */}
      {/* <!-- Area Chart --> */}
      {/* {events.length > 0 ? (
          <div className="col-12">
            <div>
              <Slider {...settings}>
                {events.map((item) => (
                  <div className="card event-card" key={item.id}>
                    <div class="events-sec">
                      <img
                        className="event-image"
                        src={imageBaseUrl + item.image}
                        alt={item.title}
                        style={{
                          borderRadius: "20px",
                          objectFit: "cover",
                          padding: "10px 8px",
                          width: "100%",
                        }}
                      />

                      <div class="slick-img-content card-body">
                        {item.status === 0 && <p>Pending</p>}
                        {item.status === 1 && <p>Live</p>}
                        {item.status === 2 && <p>Cancelled</p>}
                      </div>
                    </div>

                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.event_date}</p>
                      <p className="card-text">{item.location}</p>
                      <Link
                        to={`view-event/${item.id}`}
                        className="btn btn-primary"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ) : (
          <div className="card event-card p-3 text-center"> No Data Found</div>
        )}
      </div> */}

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
