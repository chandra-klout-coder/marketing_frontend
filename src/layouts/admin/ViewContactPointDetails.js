import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { Link, useParams } from "react-router-dom";

function ViewContactPointDetails() {
  const userId = useParams().id;
  //   const userId = "66221a0fb145401ce67cde7f";
  const token = useSelector((state) => state.auth.token);

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);

  const [filteredMembers, setFilteredMembers] = useState([]);

  const [dataFound, setDataFound] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .post(
        "/user/getTotalContactViews",
        { userId },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        if (res.data.status === true) {
          setDataFound(true);

          setMembers(res.data.result.contactUserData);
          setFilteredMembers(res.data.result.contactUserData);
        } else if (res.data.status === false) {
          setDataFound(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching chat data:", error);
        setLoading(false);
      });
  }, [token, userId]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const paginatedData = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredMembers);

    // Create a workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    // Export the workbook to Excel file
    XLSX.writeFile(workbook, "contacts_list.csv");
  };

  const capitalizeWord = (str) => {
    // return str.charAt(0).toUpperCase() + str.slice(1);
    return str;
  };

  let MemberList = "";

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
    MemberList = paginatedData.map((item) => {
      return (
        <tr key={item._id}>
          {/* <td>{item.id}</td> */}
          <td>
            {capitalizeWord(item.first_name)} {capitalizeWord(item.last_name)}
          </td>
          <td>{item.designation}</td>
          <td>{item.emailId}</td>
          <td>{item.mobileNumber}</td>

          {/* <td>
            <Link
              to={`/admin/view-contact-point-details/${item.userId}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="View Connect Point Details"
              className="btn btn-sm btn-secondary btn-circle"
              style={{ borderRadius: "50%", color: "#fff" }}
            >
              <i class="fas fa-regular fa-address-book"></i>
            </Link>
            &nbsp;
            <Link
              to={`/admin/view-chat-point-details/${item.userId}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="View Chat Point Details"
              className="btn btn-sm btn-info btn-circle"
              style={{ borderRadius: "50%", color: "#fff" }}
            >
              <i class="far fa-regular fa-comment"></i>
            </Link>
          </td> */}
        </tr>
      );
    });
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">All Contacts</h1>

        <div className="d-none d-sm-inline-block shadow-sm">
          <Link
            to={`/admin/connects`}
            className="btn btn-sm btn-primary shadow-sm"
            style={{
              backgroundColor: "#F5007E",
              borderColor: "#F5007E",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go back
          </Link>
        </div>
      </div>

      <div className="row p-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Contacts</h6>
          </div>
          <div className="card-body">
            <div className="row pb-4">
              {/* <div className="col-6 col-lg-3">
                <input
                  type="text"
                  placeholder="Filter by Member"
                  value={memberFilter}
                  className="form-control"
                  onChange={(e) => setMemberFilter(e.target.value)}
                />
              </div> */}
              {/* 
              <div className="col-2">
                <input
                  type="text"
                  placeholder="Filter by First-Name"
                  value={firstNameFilter}
                  className="form-control"
                  onChange={(e) => setFirstNameFilter(e.target.value)}
                />
              </div> */}

              <div className="col-3">
                <button
                  onClick={exportToExcel}
                  className="btn btn-success float-left"
                >
                  <i className="fa fa-solid fa-download"></i> Download
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>

                <tbody>
                  {MemberList.length > 0 ? (
                    MemberList
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={9}>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <nav aria-label="Page navigation comments" className="mt-4">
                {filteredMembers.length > 0 && (
                  <ReactPaginate
                    previousLabel="<< Previous"
                    nextLabel="Next >>"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(filteredMembers.length / itemsPerPage)}
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

export default ViewContactPointDetails;
