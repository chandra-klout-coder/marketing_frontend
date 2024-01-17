import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import DefaultBanner from "../../assets/images/default-banner.jpg";

function AllReports() {
  
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const [reports, setReports] = useState([]);

  const [user, setUser] = useState([]);

  const [filteredReports, setFilteredReports] = useState([]);

  const [nameFilter, setNameFilter] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  
  useEffect(() => {

    if (localStorage.getItem("auth_token") === null) {
      history.push("/login");
    }

    axios.get("/api/reports").then((res) => {
      if (res.data.status === 200) {
        setReports(res.data.data);
        setFilteredReports(res.data.data);
      }
      setLoading(false);
    });

    axios.get(`/api/profile`).then((res) => {
      if (res.data.status === 200) {
        setUser(res.data.user);
      }
    });
  }, [history]);

  useEffect(() => {
    const filtered = reports.filter((report) => {
      const nameMatch = report.report_name.includes(nameFilter);
      return nameMatch;
    });
  }, [nameFilter, reports]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const paginatedData = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const capitalizeWord = (str) => {
    if (str !== undefined) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  const downloadReportExcelSheet = (fileName, reportRows) => {
    const data = [
      [
        "event_name",
        "first_name",
        "last_name",
        "image",
        "virtual_business_card",
        "job_title",
        "company_name",
        "industry",
        "email_id",
        "phone_number",
        "website",
        "linkedin_page_link",
        "employee_size",
        "company_turn_over",
        "status",
        "profile_completed",
        "alternate_mobile_number",
      ],
      ...Object.values(reportRows).map((obj) => Object.values(obj)),
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");

    // Create a virtual anchor element and trigger download
    const link = document.createElement("a");

    link.setAttribute("href", encodeURI(csvContent));

    link.setAttribute("download", `${fileName}_${timestamp}.csv`);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    // setTimeout(() => {
    //   window.location.reload();
    // }, 2000);
  };

  const downloadReport = (e, id, reportName) => {
    axios.get(`/api/event-report-download/${id}`).then((res) => {
      if (res.data.status === 200) {
        downloadReportExcelSheet(reportName, res.data.data);
      }
    });
  };

  const deleteReport = (e, id) => {
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
          .delete(`/api/reports/${id}`)
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

  let reportsList = "";

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
    reportsList = paginatedData.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>

          <td style={{ padding: "14px 4px" }}>{item.report_name}</td>

          <td>
            {capitalizeWord(user.first_name)} {user.last_name}
          </td>

          <td>{item.created_at}</td>

          <td>
            <span>{item.status == 0 && <b> Pending </b>}</span>
            <span>{item.status == 1 && <b> Success</b>}</span>
          </td>

          <td className="">
            <button
              onClick={(e) => downloadReport(e, item.id, item.report_name)}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Download Report"
              className="btn btn-sm btn-info btn-circle"
              style={{ borderRadius: "50%", color: "#fff" }}
            >
              <i className="fa fa-download" aria-hidden="true"></i>
            </button>
            &nbsp; &nbsp;
            <button
              data-toggle="tooltip"
              data-placement="bottom"
              title="Delete Report"
              className="btn btn-sm btn-danger btn-circle"
              onClick={(e) => deleteReport(e, item.id)}
              style={{ borderRadius: "50%" }}
            >
              <i className="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">All Reports</h1>

        <Link
          to="/admin/reports"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          style={{
            backgroundColor: "#F5007E",
            borderColor: "#F5007E",
            color: "white",
            borderRadius: "12px",
          }}
        >
          <i className="fa fa-plus fa-sm"></i> Create New Report
        </Link>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Reports</h6>
          </div>
          <div className="card-body">
            {/* <div className="row pb-4" style={{}}>
              <div className="col-3">
                <input
                  type="text"
                  placeholder="Filter by Report Name"
                  value={nameFilter}
                  className="form-control"
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
            </div> */}

            <div className="table-responsive">
              <table className="table table-hover" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Report-ID</th>
                    <th>Report Name</th>
                    <th>Created By </th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsList.length > 0 ? (
                    reportsList
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
                {filteredReports.length > 0 && (
                  <ReactPaginate
                    previousLabel="<< Previous"
                    nextLabel="Next >>"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(filteredReports.length / itemsPerPage)}
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

export default AllReports;
