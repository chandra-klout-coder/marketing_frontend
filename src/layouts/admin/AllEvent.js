import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import DefaultBanner from "../../assets/images/default-banner.jpg";

function AllEvent() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [eventDateFilter, setEventDateFilter] = useState("");
  const [eventStatusFilter, setEventStatusFilter] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  useEffect(() => {
    axios.get("/api/events").then((res) => {
      if (res.data.status === 200) {
        setEvents(res.data.data);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Apply filters whenever name, email, or phoneFilter changes
    const filtered = events.filter((event) => {

      const titleMatch = event.title
        .toLowerCase()
        .includes(titleFilter.toLowerCase());

      const locationMatch = event.location
        .toLowerCase()
        .includes(locationFilter.toLowerCase());

      // const eventDateMatch = event.event_date.includes(eventDateFilter);

      return titleMatch && locationMatch; //eventDateMatch; //&& eventStatusMatch;
    });

    // Apply search filter
    const searchFiltered = filtered.filter((event) =>
      event.title.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredEvents(searchFiltered);
  }, [
    titleFilter,
    locationFilter,
    // eventDateFilter,
    // eventStatusFilter,
    search,
    events,
  ]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const paginatedData = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const capitalizeWord = (str) => {
  //   return str.charAt(0).toUpperCase() + str.slice(1);
  // };

  const deleteEvent = (e, id) => {
    e.preventDefault();

    const thisClicked = e.currentTarget;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/events/${id}`)
          .then(function (res) {
            Swal.fire({
              icon: "success",
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
            thisClicked.closest("tr").remove();
          })
          .catch(function (error) {
            Swal.fire({
              icon: "error",
              title: "An Error Occured!",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  let eventsList = "";

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
    eventsList = paginatedData.map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>
            {item.image ? (
              <img
                src={imageBaseUrl + item.image}
                width="320"
                height="180"
                alt={item.title}
                style={{
                  borderRadius: "20px",
                  objectFit: "cover",
                  padding: "10px 8px",
                }}
              />
            ) : (
              <img
                src={DefaultBanner}
                width="320"
                height="180"
                alt="defaultBanner"
                style={{
                  borderRadius: "20px",
                  objectFit: "cover",
                  padding: "10px 8px",
                }}
              />
            )}
          </td>
          <td style={{ padding: "14px 4px" }}>{item.title}</td>
          <td>
            <span>
              <b>Date of Event : </b>
              {item.event_date}
            </span>
            <br />

            <span>
              <b>Location : </b> {item.city}
            </span>
            <br />
            <span>
              <b>Time : </b> {item.start_time}:{item.start_minute_time}{" "}
              {item.start_time_type} {" - "}
              {item.end_time}:{item.end_minute_time} {item.end_time_type}
            </span>
            <br />
          </td>
          <td>
            <span>
              <b>Total Attendee : </b>
              {item.total_attendee}
            </span>
            <br />
            <span>
              <b>Total Not Accepted : </b>
              {item.total_not_accepted}
            </span>
            <br />
            <span>
              <b>Total Accepted : </b>
              {item.total_accepted}
            </span>
            <br />
            <span>
              <b>Total Rejected : </b>
              {item.total_rejected}
            </span>
          </td>

          <td>
            <span>{item.status === 0 && <b> Pending </b>}</span>
            <span>{item.status === 1 && <b> Active </b>}</span>
            <span>{item.status === 2 && <b> Cancelled </b>}</span>
          </td>

          <td className="text-center p-4" style={{ display: "contents" }}>
            <Link
              to={`all-attendee/${item.uuid}`} //id to uuid
              data-toggle="tooltip"
              data-placement="bottom"
              title="All Attendees"
              className="btn btn-sm btn-warning btn-circle mt-2"
              style={{ borderRadius: "50%" }}
            >
              <i class="fas fa-user"></i>
            </Link>
            &nbsp; &nbsp;

            <Link
              to={`add-sponsors/${item.uuid}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Add Sponsors"
              className="btn btn-sm btn-secondary btn-circle mt-2"
              style={{ borderRadius: "50%" }}
            >
              {/* <i class="fas fa-user"></i> */}
              <i class="fa fa-solid fa-user-plus"></i>
            </Link>
            &nbsp; &nbsp;

            <Link
              to={`view-event/${item.uuid}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="View Event"
              className="btn btn-sm btn-info btn-circle mt-2"
              style={{ borderRadius: "50%", color: "#fff" }}
            >
              <i class="fas fa-eye"></i>
            </Link>
            &nbsp; &nbsp;
            <Link
              to={`edit-event/${item.uuid}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Edit Event"
              className="btn btn-sm btn-primary btn-circle mt-2"
              style={{ borderRadius: "50%" }}
            >
              <i class="fas fa-edit"></i>
            </Link>
            &nbsp; &nbsp;
            <button
              data-toggle="tooltip"
              data-placement="bottom"
              title="Delete Event"
              className="btn btn-sm btn-danger btn-circle mt-2"
              onClick={(e) => deleteEvent(e, item.id)}
              style={{ borderRadius: "50%" }}
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">All Events</h1>

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
          <i className="fa fa-plus fa-sm mx-1"></i> Create New Event
        </Link>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Events</h6>
          </div>
          <div className="card-body">
            <div className="row pb-4" style={{}}>
              <div className="col-3">
                {/* Name filter input */}
                <label forHtml="Event Name">Event Name</label>
                <input
                  type="text"
                  placeholder="Filter by Event Name"
                  value={titleFilter}
                  className="form-control"
                  onChange={(e) => setTitleFilter(e.target.value)}
                />
              </div>

              {/* Event Date filter input */}
              {/* <div className="col-3">
                <label forHtml="Event Name">Select Event Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="event_start_date"
                  value={eventDateFilter}
                  onChange={(e) => setEventDateFilter(e.target.value)}
                />
              </div> */}

              {/*Status filter input */}
              {/* <div className="col-3">
                <label forHtml="Event Name">Select Event Status</label>
                <select
                  className="form-control"
                  name="status"
                  value={eventStatusFilter}
                  onChange={(e) => setEventStatusFilter(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="0">Pending</option>
                  <option value="1">Active</option>
                  <option value="2">Cancelled</option>
                </select>
              </div> */}

              {/* Phone filter input */}
              {/* <div className="col-3">
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
                // id="dataTable"
                width="100%"
                cellspacing="4"
              >
                <thead>
                  <tr>
                    <th>Event-ID</th>
                    <th>Event Image</th>
                    <th>Event Name</th>
                    <th>Event Details</th>
                    <th>Attendee Details</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsList.length > 0 ? (
                    eventsList
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={7}>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <nav aria-label="Page navigation comments" className="mt-4">
                {filteredEvents.length > 0 && (
                  <ReactPaginate
                    previousLabel="<< Previous"
                    nextLabel="Next >>"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(filteredEvents.length / itemsPerPage)}
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

export default AllEvent;
