import React, { useState, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";

import { useSelector } from "react-redux";

import loadingGif from "../../assets/images/load.gif";

function UploadMembers() {
  const token = useSelector((state) => state.auth.token);

  const userId = localStorage.getItem("userId");

  const history = useHistory();

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [errorsExcel, setErrorsExcel] = useState({});
  const [invalidMessage, setInvalidMessage] = useState("");
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [columnData, setColumnData] = useState({});
  const [inValidData, setInValidData] = useState({});
  const [downloadInvalidExcel, setDownloadInvalidExcel] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  //   const handleFileChange = (e) => {
  //     const file = e.target.files[0];

  //     if (file) {
  //       setSelectedImage(URL.createObjectURL(file));

  //       setFormInput((prevData) => ({
  //         ...prevData,
  //         image: file,
  //       }));
  //     }
  //   };

  const closeAlert = () => {
    setShowAlert(false);
  };

  //Download Excel CSV Format
  const downloadExcelSheet = () => {
    const data = [
      [
        "first_name",
        "last_name",
        "emailId",
        "password",
        "mobileNumber",
        "designation",
      ],
      [
        "John",
        "Doe",
        "johndoe@example.com",
        "Hello@World",
        "7865656575",
        "Speaker",
      ],
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    // Create a virtual anchor element and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "member_list_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [excelInput, setExcelInput] = useState({
    file: null,
  });

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setExcelInput({ ...excelInput, file });
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setErrorsExcel({ message: "Please select an Excel file." });
      alert("No file");
      return;
    }
    
    const formData = new FormData();

    formData.append("file", file);
    formData.append("userId", userId);

    await axios
      .post(`/user/upload-users`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": token,
        },
      })
      .then((res) => {
        if (res.data.status === true) {
          swal("Success", res.data.message, "success");

          setColumnData({});

          setInValidData({});

          setErrorsExcel({});

          setDownloadInvalidExcel(false);

          setFile(null);

          history.push(`/admin/upload-members`);
        } else if (res.data.status === 500) {
          swal("Danger", res.data.message, "danger");

          setColumnData({});

          setInValidData({});

          setErrorsExcel({});

          setDownloadInvalidExcel(false);

          setFile(null);
        }
      });
  };

  return (
    <>
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
            <h1 className="h3 mb-0 text-gray-800">Upload Member </h1>
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
              <i className="fa fa-solid fa-arrow-left"></i>&nbsp; Go Back to All
              Members
            </Link>
          </div>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              Upload Member List
            </h6>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-6">
                <div
                  style={{
                    border: "2px solid #dbdbdb",
                    borderRadius: "6px",
                    padding: "8px",
                  }}
                >
                  <h5>Upload Member List</h5>
                  <hr />

                  <form
                    className="user mt-5"
                    onSubmit={handleFileUpload}
                    encType="multipart/form-data"
                  >
                    <div className="form-group row">
                      <div className="col-12">
                        {errorsExcel !== "" &&
                          Object.keys(errorsExcel).length !== 0 && (
                            <div className="p-2">
                              <div
                                className="alert alert-danger alert-dismissible fade show"
                                role="alert"
                              >
                                {errorsExcel.message &&
                                  errorsExcel.message !== undefined &&
                                  showAlert && (
                                    <>
                                      <span>{errorsExcel.message}</span>
                                      <br />
                                    </>
                                  )}

                                <button className="close" onClick={closeAlert}>
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label forhtml="file" className="col-12 col-form-label">
                        Upload File
                      </label>
                      <div className="col-12">
                        <input
                          type="file"
                          className={`form-control ${
                            errors.file ? "is-invalid" : ""
                          }`}
                          name="file"
                          onChange={handleExcelFileChange}
                          ref={fileInputRef}
                          // value={formInput.file}
                          // ref={fileInputRef}
                        />
                        {errors.file && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.file}
                          </div>
                        )}
                        <div className="form-group row mt-4">
                          <div className="col-8 mb-3 mb-sm-0">
                            <button
                              className="btn btn-primary btn-user"
                              style={{
                                backgroundColor: "#F5007E",
                                borderColor: "#F5007E",
                                fontSize: "14px",
                                padding: "1% 6%",
                              }}
                              disabled={isLoadingExcel}
                            >
                              {isLoadingExcel ? (
                                <img
                                  src={loadingGif}
                                  alt="Loading..."
                                  style={{ width: "20px", height: "20px" }}
                                />
                              ) : (
                                "Upload File Now"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-6 text-center p-5">
                <span className="text-sm">
                  ( <b> Instruction </b> :- Download Member Excel Sample Format
                  )
                </span>

                <div className="m-4 ">
                  <button
                    onClick={downloadExcelSheet}
                    className="btn btn-primary"
                  >
                    Download Sample Excel CSV Sheet Format
                    <i className="fa fa-download mx-2"></i>
                  </button>
                </div>

                <hr />
                <div className="m-4 ">
                  <Link to="/admin/add-member" className="btn btn-primary">
                    Add Member (Manually)
                    <i className="fa fa-arrow-right mx-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadMembers;
