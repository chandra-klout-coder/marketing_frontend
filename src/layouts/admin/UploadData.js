import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

function UploadData(props) {

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [event, setEvent] = useState([]);

  const [search, setSearch] = useState("");
  const [firstNameFilter, setFirstNameFilter] = useState("");
  const [emailIDFilter, setEmailIDFilter] = useState("");
  const [memberFilter, setMemberFilter] = useState("");

  const [phoneFilter, setPhoneFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const [event_id, setEventID] = useState(props.match.params.id);

  useEffect(() => {
    axios.get("/api/members").then((res) => {
      if (res.data.status === 200) {
        setMembers(res.data.data);
        setFilteredMembers(res.data.data);
      }
      setLoading(false);
    });
  }, []);

  // useEffect(() => {
  //   // Apply filters whenever name, email, or phoneFilter changes
  //   const filtered = members.filter((member) => {
  //     const eventMatch = member.title
  //       .toLowerCase()
  //       .includes(eventFilter.toLowerCase());

  //     const firstnameMatch = member.first_name
  //       .toLowerCase()
  //       .includes(firstNameFilter.toLowerCase());

  //     const emailMatch = member.email_id
  //       .toLowerCase()
  //       .includes(emailIDFilter.toLowerCase());

  //     // const phoneMatch = attendee.phone_number.includes(phoneFilter);

  //     return firstnameMatch && emailMatch && eventMatch; // && phoneMatch;
  //   });

  //   // Apply search filter
  //   const searchFiltered = filtered.filter((attendee) =>
  //     attendee.first_name.toLowerCase().includes(search.toLowerCase())
  //   );

  //   setFilteredAttendees(searchFiltered);
  // }, [firstNameFilter, emailIDFilter, eventFilter, search, attendees]); // phoneFilter

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const paginatedData = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = () => {
    // Convert attendee data to Excel worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredMembers);

    // Create a workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    // Export the workbook to Excel file
    XLSX.writeFile(workbook, "attendee_list.xlsx");
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
          .delete(`/api/members/${id}`)
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
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{capitalizeWord(item.first_name)}</td>
          <td>{capitalizeWord(item.last_name)}</td>
          <td>{capitalizeWord(item.company)}</td>
          <td>{item.email}</td>
          <td>{item.mobile_number}</td>
          <td>
            <Link
              to={`/admin/view-member/${item.id}`}
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
              to={`/admin/edit-member/${item.id}`}
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
              title="Delete Member"
              className="btn btn-sm btn-danger btn-circle"
              onClick={(e) => deleteMember(e, item.id)}
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
        <h1 className="h3 mb-0 text-gray-800">Upload Data List</h1>

        <div className="d-none d-sm-inline-block shadow-sm">
          <Link
            to={`/admin/upload-member-data`}
            className="btn btn-sm btn-primary shadow-sm"
            style={{
              backgroundColor: "#F5007E",
              borderColor: "#F5007E",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <i className="fa fa-solid fa-user-plus"></i> &nbsp; Upload Member Data
          </Link>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Member List</h6>
          </div>
          <div className="card-body">
            <div className="row pb-4">
              <div className="col-6 col-lg-3">
                <input
                  type="text"
                  placeholder="Filter by Member"
                  value={memberFilter}
                  className="form-control"
                  onChange={(e) => setMemberFilter(e.target.value)}
                />
              </div>

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
                    <th>Member-ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
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

export default UploadData;
