import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";

function AllMember(props) {
  const token = useSelector((state) => state.auth.token);

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);

  const [filteredMembers, setFilteredMembers] = useState([]);

  const [search, setSearch] = useState("");
  const [firstNameFilter, setFirstNameFilter] = useState("");
  const [emailIDFilter, setEmailIDFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    axios
      .get("/user/admin-sub-admin-list", {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        if (res.data.status === true) {
          setMembers(res.data.result.adminUsers);
          setFilteredMembers(res.data.result.adminUsers);
          setExcelData(res.data.result.usersData);
        }
      });
  }, [token]);

  useEffect(() => {
    const filtered = members.filter((member) => {
      const firstnameMatch = member.first_name
        .toLowerCase()
        .includes(firstNameFilter.toLowerCase());

      const emailMatch = member.emailId
        .toLowerCase()
        .includes(emailIDFilter.toLowerCase());

      // const phoneMatch = member.mobileNumber.includes(phoneFilter);

      return firstnameMatch && emailMatch; //&& phoneMatch;
    });

    // Apply search filter
    const searchFiltered = filtered.filter((member) =>
      member.first_name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredMembers(searchFiltered);
  }, [members, firstNameFilter, emailIDFilter, search]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const paginatedData = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    XLSX.writeFile(workbook, "all_member_list.csv");
  };

  const capitalizeWord = (str) => {
    // return str.charAt(0).toUpperCase() + str.slice(1);
    return str;
  };

  const deleteMember = (e, id) => {
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
          .delete(`/user/${id}`, {
            headers: {
              "x-access-token": token,
            },
          })
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

  let MemberList = "";

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
    MemberList = paginatedData.map((item) => {
      return (
        <tr key={item._id}>
          <td>{capitalizeWord(item.first_name)}</td>
          <td>{capitalizeWord(item.last_name)}</td>
          <td>{capitalizeWord(item.emailId)}</td>
          <td>{item.mobileNumber}</td>
          <td>{item.company}</td>
          <td>{item.designation}</td>
          <td>
            <Link
              to={`/admin/view-member/${item._id}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="View Member Detail"
              className="btn btn-sm btn-info btn-circle"
              style={{ borderRadius: "50%", color: "#fff" }}
            >
              <i className="fas fa-eye"></i>
            </Link>
            &nbsp; &nbsp;
            <Link
              to={`/admin/edit-member/${item._id}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Edit Member"
              className="btn btn-sm btn-primary btn-circle"
              style={{ borderRadius: "50%" }}
            >
              <i className="fas fa-edit"></i>
            </Link>
            &nbsp; &nbsp;
            <button
              data-toggle="tooltip"
              data-placement="bottom"
              title="Delete Member"
              className="btn btn-sm btn-danger btn-circle"
              onClick={(e) => deleteMember(e, item._id)}
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
        <h1 className="h3 mb-0 text-gray-800">All Members</h1>

        <div className="d-none d-sm-inline-block shadow-sm">
          <Link
            to={`/admin/add-member`}
            className="btn btn-sm btn-primary shadow-sm"
            style={{
              backgroundColor: "#F5007E",
              borderColor: "#F5007E",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <i className="fa fa-solid fa-plus"></i> &nbsp; Add Member
          </Link>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Members</h6>
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

              <div className="col-2">
                <input
                  type="text"
                  placeholder="Filter by First-Name"
                  value={firstNameFilter}
                  className="form-control"
                  onChange={(e) => setFirstNameFilter(e.target.value)}
                />
              </div>

              <div className="col-8"></div>

              <div className="col-2">
                <button
                  onClick={exportToExcel}
                  className="btn btn-success float-right"
                >
                  <i className="fa fa-solid fa-download"></i> Export to Excel
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Company</th>
                    <th>Designation</th>
                    <th>Action</th>
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
      {/* </div> */}
    </>
  );
}

export default AllMember;
