import React, { useState, useRef } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";

import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

function AddAttendee(props) {
  const history = useHistory();

  const fileInputRef = useRef(null);

  const event_id = props.match.params.id;

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

  const [formInput, setFormInput] = useState({
    event_id: event_id,
    first_name: "",
    last_name: "",
    job_title: "",
    company_name: "",
    industry: "",
    email_id: "",
    phone_number: "",
    alternate_mobile_number: "",
    website: "",
    linkedin_page_link: "",
    employee_size: "",
    company_turn_over: "",
    status: "",
    // image: null,
  });

  const handleInput = (e) => {
    e.persist();
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    switch (name) {
      case "first_name":
        if (value === "") {
          fieldErrors[name] = "First Name is required.";
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          fieldErrors[name] =
            "First Name should only contain alphabets and spaces.";
        } else if (value.length > 30) {
          fieldErrors[name] = "Maximum 30 Characters Allowed.";
        }
        break;

      case "last_name":
        if (value === "") {
          fieldErrors[name] = "Last Name is required.";
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          fieldErrors[name] =
            "Last Name should only contain alphabets and spaces.";
        } else if (value.length > 30) {
          fieldErrors[name] = "Maximum 30 Characters Allowed.";
        }
        break;
      case "email_id":
        if (value === "") {
          fieldErrors[name] = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors[name] = "Invalid email format.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed in Email.";
        }
        break;

      case "phone_number":
        if (value !== "") {
          if (!/^\d{10}$/.test(value)) {
            fieldErrors[name] = "Invalid phone number. Must be 10 digits.";
          }
        }
        break;

      case "alternate_mobile_number":
        if (value !== "") {
          if (!/^\d{10}$/.test(value)) {
            fieldErrors[name] = "Invalid Alt. phone number. Must be 10 digits.";
          }
        }
        break;

      case "job_title":
        if (value === "") {
          fieldErrors[name] = "Job Title is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "company_name":
        if (value === "") {
          fieldErrors[name] = "Company Name is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "industry":
        if (value === "") {
          fieldErrors[name] = "Industry is required.";
        } else if (value.length > 30) {
          fieldErrors[name] = "Maximum 30 Characters Allowed.";
        }
        break;

      case "website":
        if (value !== "") {
          if (value.length > 100) {
            fieldErrors[name] = "Maximum 100 Characters Allowed in website.";
          } else if (value.length > 100) {
            fieldErrors[name] = "Maximum 100 Characters Allowed in website.";
          }
        }
        break;

      case "employee_size":
        if (value !== "") {
          if (value.length > 8) {
            fieldErrors[name] = "At Most 8 Digits only";
          }
        }
        break;

      case "status":
        if (value === "") {
          fieldErrors[name] = "Status is required";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldErrors,
    }));
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormInput((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    e.target.classList.remove("is-invalid");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(URL.createObjectURL(file));

      setFormInput((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  //Add Attendee Form
  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldErrors = {};

    if (
      !formInput.first_name === "" ||
      /^\s*$/.test(formInput.first_name) ||
      formInput.first_name.length === 0
    ) {
      fieldErrors.first_name = "First Name is required.";
    } else if (!/^[a-zA-Z\s]*$/.test(formInput.first_name)) {
      fieldErrors.first_name =
        "Last Name should only contain alphabets and spaces.";
    }

    if (
      formInput.last_name === "" ||
      /^\s*$/.test(formInput.last_name) ||
      formInput.last_name.length === 0
    ) {
      fieldErrors.last_name = "Last Name is required.";
    }
    if (
      formInput.email_id === "" ||
      /^\s*$/.test(formInput.email_id) ||
      formInput.email_id.length === 0
    ) {
      fieldErrors.email_id = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formInput.email_id)) {
      fieldErrors.email_id = "Invalid email format.";
    } else if (formInput.email_id.length > 100) {
      fieldErrors.email_id = "Maximum 100 Characters Allowed in Email.";
    }

    if (formInput.phone_number !== "") {
      if (
        /^\s*$/.test(formInput.phone_number) ||
        !/^\d{10}$/.test(formInput.phone_number)
      ) {
        fieldErrors.phone_number = "Invalid phone number. Must be 10 digits.";
      }
    }

    if (formInput.alternate_mobile_number !== "") {
      if (
        /^\s*$/.test(formInput.alternate_mobile_number) ||
        !/^\d{10}$/.test(formInput.alternate_mobile_number)
      ) {
        fieldErrors.alternate_mobile_number =
          "Invalid Alt phone number. Must be 10 digits.";
      }
    }

    if (
      formInput.alternate_mobile_number !== "" &&
      formInput.alternate_mobile_number.length !== 0
    ) {
      if (formInput.alternate_mobile_number === formInput.phone_number) {
        fieldErrors.alternate_mobile_number =
          "Alt. phone number should be different from Phone Number.";
      }
    }

    if (formInput.job_title === "" || /^\s*$/.test(formInput.job_title)) {
      fieldErrors.job_title = "Job Title is required.";
    } else if (formInput.job_title.length > 100) {
      fieldErrors.job_title = "Maximum 100 Characters Allowed in website.";
    }

    if (
      formInput.company_name === "" ||
      /^\s*$/.test(formInput.company_name) ||
      formInput.company_name.length === 0
    ) {
      fieldErrors.company_name = "Company Name is required.";
    }

    if (
      formInput.industry === "" ||
      /^\s*$/.test(formInput.industry) ||
      formInput.industry.length === 0
    ) {
      fieldErrors.industry = "Industry is required.";
    }

    if (formInput.image) {
      const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedFormats.includes(formInput.image.type)) {
        fieldErrors.image =
          "Invalid file format. Only JPEG, PNG, and GIF formats are allowed.";
      }
    }

    if (formInput.website !== "") {
      if (/^\s*$/.test(formInput.website)) {
        fieldErrors.website = "Invalid website link.";
      } else if (formInput.website.length > 100) {
        fieldErrors.website = "Maximum 100 Characters Allowed in website.";
      }
    }

    if (formInput.linkedin_page_link !== "") {
      if (/^\s*$/.test(formInput.website)) {
        fieldErrors.linkedin_page_link =
          "Invalid LinkedIn profile format. Include full profile URL.";
      }
    }

    if (formInput.company_turn_over !== "") {
      if (/^\s*$/.test(formInput.company_turn_over)) {
        fieldErrors.company_turn_over =
          "Invalid company turn over. Must be a number.";
      }
    }

    if (formInput.status === "") {
      fieldErrors.status = "Status is required.";
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("image", formInput.image);
      formData.append("event_id", formInput.event_id);
      formData.append("first_name", formInput.first_name);
      formData.append("last_name", formInput.last_name);
      formData.append("job_title", formInput.job_title);
      formData.append("company_name", formInput.company_name);
      formData.append("industry", formInput.industry);
      formData.append("email_id", formInput.email_id);
      formData.append("phone_number", formInput.phone_number);
      formData.append(
        "alternate_mobile_number",
        formInput.alternate_mobile_number
      );
      formData.append("website", formInput.website);
      formData.append("linkedin_page_link", formInput.linkedin_page_link);
      formData.append("employee_size", formInput.employee_size);
      formData.append("company_turn_over", formInput.company_turn_over);
      formData.append("status", formInput.status);

      axios
        .post(`/api/attendees`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setFormInput({
              ...formInput,
              event_id: "",
              first_name: "",
              last_name: "",
              job_title: "",
              company_name: "",
              industry: "",
              email_id: "",
              phone_number: "",
              alternate_mobile_number: "",
              website: "",
              linkedin_page_link: "",
              employee_size: "",
              company_turn_over: "",
              status: "",
            });

            setErrors({});

            history.push(`/admin/all-attendee/${event_id}`);
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            swal("All fields are mandatory", "", "error");

            history.push(`/admin/all-attendee/${event_id}`);
          }
        }).finally(() => {
          setIsLoading(false);
          // button.disabled = false;
        });
        
    } else {
      setErrors(fieldErrors);
    }
    setIsLoading(false);
  };

  // Upload Excel
  const downloadExcelSheet = () => {
    // Create sample Excel sheet data
    const data = [
      [
        "first_name",
        "last_name",
        "job_title",
        "company_name",
        "industry",
        "email",
        "phone_number",
        "alternate_mobile_number",
        "website",
        "status",
        "employee_size",
        "company_turn_over",
        "linkedin_page_link",
      ],
      [
        "John",
        "Doe",
        "CEO",
        "Digimantra",
        "IT",
        "johndoe@example.com",
        "8709289369",
        "7865656575",
        "www.digimantra.com",
        "Speaker",
        "200",
        "5M",
        "https://linkedin/company/digimantra",
      ],
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    // Create a virtual anchor element and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "attendee_list_data.csv");
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

  const downloadInvalidExcelSheet = () => {
    const data = [
      [
        "first_name",
        "last_name",
        "job_title",
        "company_name",
        "industry",
        "email",
        "phone_number",
        "alternate_mobile_number",
        "website",
        "status",
        "employee_size",
        "company_turn_over",
        "linkedin_page_link",
      ],
      ...Object.values(inValidData).map((obj) => Object.values(obj)),
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");

    // Create a virtual anchor element and trigger download
    const link = document.createElement("a");

    link.setAttribute("href", encodeURI(csvContent));

    link.setAttribute(
      "download",
      `attendee_invalid_list_data_${timestamp}.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    setDownloadInvalidExcel(false);

    if (!file) {
      setErrorsExcel({ message: "Please select an Excel file." });
      return;
    }

    setIsLoadingExcel(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("event_id", event_id);

    await axios
      .post(`/api/attendees/upload/${event_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success");

          setColumnData({});

          setInValidData({});

          setErrorsExcel({});

          setDownloadInvalidExcel(false);

          setFile(null);

          history.push(`/admin/all-attendee/${event_id}`);
        } else if (res.data.status === 400) {
          setDownloadInvalidExcel(true);

          setColumnData(res.data.column_data);

          setInValidData(res.data.invalid_data);

          setInvalidMessage(res.data.message);

          setErrorsExcel(res.data.errors);

          setFile(null);

          setExcelInput({ ...excelInput, file: null });

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else if (res.data.status === 422) {
          setColumnData({});

          setInValidData({});

          setErrorsExcel({ message: res.data.error });

          setFile(null);

          setExcelInput({ ...excelInput, file: null });

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else if (res.data.status === 401) {
          setColumnData({});

          setInValidData({});

          setDownloadInvalidExcel(false);

          setErrorsExcel({ message: res.data.message });

          setFile(null);

          setExcelInput({ ...excelInput, file: null });

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      });

    setIsLoadingExcel(false);
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
            <h1 className="h3 mb-0 text-gray-800">Add Attendee </h1>
            <Link
              to={`/admin/all-attendee/${event_id}`}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i>&nbsp; Go Back
            </Link>
          </div>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Add Attendee</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div
                className="col-12 col-lg-7 right-border"
                // style={{ borderRight: "2px solid #dbdbdb" }}
              >
                <h5 className="text-center">Add Attendee Details</h5>
                <hr />
                <form
                  className="user mt-5"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  {/* Name */}
                  <div className="form-group row">
                    <label
                      forhtml="first_name"
                      className="col-12 col-form-label"
                    >
                      Name
                    </label>
                    <div className="col-6">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.first_name ? "is-invalid" : ""
                        }`}
                        placeholder="First Name"
                        name="first_name"
                        value={formInput.first_name}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.first_name && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.first_name}
                        </div>
                      )}
                    </div>

                    <div className="col-6">
                      <input
                        type="text"
                        className={`form-control ${
                          errors.last_name ? "is-invalid" : ""
                        }`}
                        placeholder="Last Name"
                        name="last_name"
                        value={formInput.last_name}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.last_name && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.last_name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Last Name  */}
                  <div className="form-group row">
                    <label forhtml="email" className="col-12 col-form-label">
                      Email
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="email"
                          className={`form-control ${
                            errors.email_id ? "is-invalid" : ""
                          }`}
                          placeholder="Email"
                          name="email_id"
                          value={formInput.email_id}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.email_id && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.email_id}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      forhtml="phone_number"
                      className="col-12 col-form-label"
                    >
                      Phone Number
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.phone_number ? "is-invalid" : ""
                          }`}
                          placeholder="Phone Number"
                          name="phone_number"
                          maxLength={10}
                          value={formInput.phone_number}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.phone_number && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.phone_number}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12 mb-3 mt-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.alternate_mobile_number ? "is-invalid" : ""
                          }`}
                          placeholder="Alternate Phone Number"
                          name="alternate_mobile_number"
                          maxLength={10}
                          value={formInput.alternate_mobile_number}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.alternate_mobile_number && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.alternate_mobile_number}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* File - Image  */}
                  <div className="form-group row">
                    <label forhtml="file" className="col-12 col-form-label">
                      Profile Picture
                    </label>
                    <div className="col-12">
                      <input
                        type="file"
                        className={`form-control ${
                          errors.image ? "is-invalid" : ""
                        }`}
                        name="file"
                        onChange={handleFileChange}
                        onBlur={handleBlur}
                      />

                      {errors.image && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.image}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <p style={{ fontSize: "12px", float: "right" }}>
                        * Upload Profile Jpg / Png Only.
                      </p>
                      {formInput.image ? (
                        <img
                          src={selectedImage}
                          width="100%"
                          alt={formInput.image}
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      ) : (
                        <img
                          src={Defaultuser}
                          width="100%"
                          alt={"default-user"}
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Job Title  */}
                  <div className="form-group row">
                    <label forhtml="job_title" className="col-12 col-form-label">
                      Job Title
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="job_title"
                          className={`form-control ${
                            errors.job_title ? "is-invalid" : ""
                          }`}
                          placeholder="Job Title"
                          name="job_title"
                          value={formInput.job_title}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.job_title && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.job_title}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="form-group row">
                    <label
                      forhtml="company_name"
                      className="col-12 col-form-label"
                    >
                      Company Name
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="company_name"
                          className={`form-control ${
                            errors.company_name ? "is-invalid" : ""
                          }`}
                          placeholder="Company Name"
                          name="company_name"
                          value={formInput.company_name}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.company_name && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.company_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event Venue  */}
                  <div className="form-group row">
                    <label forhtml="industry" className="col-12 col-form-label">
                      Industry
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="industry"
                          className={`form-control ${
                            errors.industry ? "is-invalid" : ""
                          }`}
                          placeholder="Industry"
                          name="industry"
                          value={formInput.industry}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.industry && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.industry}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event Venue  */}
                  <div className="form-group row">
                    <label forhtml="website" className="col-12 col-form-label">
                      Website
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="website"
                          className={`form-control ${
                            errors.website ? "is-invalid" : ""
                          }`}
                          placeholder="Website"
                          name="website"
                          value={formInput.website}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.website && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.website}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Event Venue  */}
                  <div className="form-group row">
                    <label
                      forhtml="linkedin_page_link"
                      className="col-12 col-form-label"
                    >
                      LinkedIn Profile Link
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="linkedin_page_link"
                          className={`form-control ${
                            errors.linkedin_page_link ? "is-invalid" : ""
                          }`}
                          placeholder="Linked Profile Link"
                          name="linkedin_page_link"
                          value={formInput.linkedin_page_link}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.linkedin_page_link && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.linkedin_page_link}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Profile Link */}
                  <div className="form-group row">
                    <label
                      forhtml="company_size"
                      className="col-12 col-form-label"
                    >
                      Employee Size
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.employee_size ? "is-invalid" : ""
                          }`}
                          placeholder="Company Size"
                          name="employee_size"
                          maxLength={8}
                          value={formInput.employee_size}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.employee_size && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.employee_size}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      forhtml="company_turn_over"
                      className="col-12 col-form-label"
                    >
                      Company Turn Over
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <input
                          type="company_turn_over"
                          className={`form-control ${
                            errors.company_turn_over ? "is-invalid" : ""
                          }`}
                          placeholder="Company Turn Over"
                          name="company_turn_over"
                          maxLength={20}
                          value={formInput.company_turn_over}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.company_turn_over && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.company_turn_over}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label forhtml="status" className="col-12 col-form-label">
                      Attendee Status
                    </label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <div className="form-group">
                        <select
                          className={`form-control ${
                            errors.status ? "is-invalid" : ""
                          }`}
                          placeholder=""
                          name="status"
                          value={formInput.status}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        >
                          <option value="">Select an Option</option>
                          <option value="speaker">Speaker</option>
                          <option value="panelist">Panellist</option>
                          <option value="sponsor">Sponsor</option>
                          <option value="delegate">Delegate</option>
                          <option value="moderator">Moderator</option>
                          <option value="others">Others</option>
                        </select>
                        {errors.status && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.status}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      forhtml="status"
                      className="col-12 col-form-label"
                    ></label>
                    <div className="col-12 mb-3 mb-sm-0">
                      <button
                        className="btn btn-primary btn-user"
                        style={{
                          backgroundColor: "#F5007E",
                          borderColor: "#F5007E",
                          fontSize: "14px",
                          padding: "1% 6%",
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <img
                              src={loadingGif}
                              alt="Loading..."
                              style={{ width: "20px", height: "20px" }}
                            />
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                        <hr />
                    </div>
                  </div>
                </form>
              </div>

              <div className="col-12 col-lg-5 text-center">
                <h5>Upload Attendee List</h5>
                <hr />

                <span className="text-sm">
                  ( <b> Instruction </b> :- Download Attendee Excel Sample
                  Format )
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
                <div
                  style={{
                    border: "2px solid #dbdbdb",
                    borderRadius: "6px",
                    padding: "8px",
                  }}
                >
                  <h5>Upload Attendee List</h5>
                  <hr />

                  <form
                    className="user mt-5"
                    onSubmit={handleFileUpload}
                    encType="multipart/form-data"
                  >
                    <div className="form-group row">
                      {/* <div className="col-2"></div> */}
                      <div className="col-12">
                        {errorsExcel !== "" &&
                          Object.keys(errorsExcel).length !== 0 && (
                            <div className="p-2">
                              <div
                                className="alert alert-danger alert-dismissible fade show"
                                role="alert"
                              >
                                {errorsExcel.message &&
                                  errorsExcel.message !== undefined && showAlert && (
                                    <>
                                      <span>{errorsExcel.message}</span>
                                      <br />
                                    </>
                                  )}

                                {errorsExcel.firstNameError && (
                                  <>
                                    <span>{errorsExcel.firstNameError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.lastNameError && (
                                  <>
                                    <span>{errorsExcel.lastNameError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.emailError && (
                                  <>
                                    <span>{errorsExcel.emailError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.phoneError && (
                                  <>
                                    <span>{errorsExcel.phoneError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.jobTitleError && (
                                  <>
                                    <span>{errorsExcel.jobTitleError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.companyNameError && (
                                  <>
                                    <span>{errorsExcel.companyNameError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.industryNameError && (
                                  <>
                                    <span>{errorsExcel.industryNameError}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.duplicateEmails && (
                                  <>
                                    <span>{errorsExcel.duplicateEmails}</span>
                                    <br />
                                  </>
                                )}

                                {errorsExcel.duplicateMobiles && (
                                  <>
                                    <span>{errorsExcel.duplicateMobiles}</span>
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

                      <div className="col-12">
                        {downloadInvalidExcel ? (
                          <>
                            <div
                              className="alert alert-danger alert-dismissible fade show"
                              role="alert"
                            >
                              {invalidMessage}
                              <br />

                              <button
                                onClick={downloadInvalidExcelSheet}
                                className="btn btn-primary"
                              >
                                Download Invalid Excel CSV Sheet
                                <i className="fa fa-download"></i>
                              </button>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="form-group row">
                      <label
                        forhtml="first_name"
                        className="col-12 col-form-label"
                      >
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
                          <label
                            forhtml="status"
                            className="col-1 col-form-label"
                          ></label>
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
                                "Upload Excel Now"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAttendee;
