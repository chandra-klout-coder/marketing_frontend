import React, { useState, useRef, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

import axios from "axios";
import swal from "sweetalert";

function AddMember(props) {
  const history = useHistory();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  const [companyData, setCompanyData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [industryData, setIndustryData] = useState([]);
  const [sponsorPackageData, setsponsorPackageData] = useState([]);

  const [companyInput, setCompanyInput] = useState(false);
  const [jobTitleInput, setJobTitleInput] = useState(false);

  useEffect(() => {
    axios.get("/api/companies").then((res) => {
      if (res.data.status === 200) {
        setCompanyData(res.data.data);
      }
    });

    axios.get("/api/industries").then((res) => {
      if (res.data.status === 200) {
        setIndustryData(res.data.data);
      }
    });

    axios.get("/api/job-titles").then((res) => {
      if (res.data.status === 200) {
        setDesignationData(res.data.data);
      }
    });
  }, []);

  const [formInput, setFormInput] = useState({
    first_name: "",
    last_name: "",
    official_email: "",
    phone_number: "",
    job_title: "",
    job_title_name: "",
    company: "",
    company_name: "",
    industry: "",
    country: "",
    website: "",
    employee_size: "",
    linkedin_page_link: "",
    brand_name: "",
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
      case "official_email":
        if (value === "") {
          fieldErrors[name] = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors[name] = "Invalid email format.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed in Email.";
        }
        break;

      case "phone_number":
        if (value == "") {
          if (!/^\d{10}$/.test(value)) {
            fieldErrors[name] = "Invalid phone number. Must be 10 digits.";
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

      case "company":
        if (value === "") {
          fieldErrors[name] = "Company is required.";
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
        if (value === "") {
          fieldErrors[name] = "Website is required.";
        } else {
          if (value.length > 100) {
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

      case "country":
        if (value == "") {
          fieldErrors[name] = "Country is required";
        }
        break;

      case "linkedin_page_link":
        if (value == "") {
          fieldErrors[name] = "Linked Page Link is required";
        }
        break;

      case "brand_name":
        if (value == "") {
          fieldErrors[name] = "Brand Name is required";
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

  const handleCompanyChange = (event) => {
    const value = event.target.value;

    if (value == 439) {
      setCompanyInput(true);
    } else {
      setCompanyInput(false);
    }

    setFormInput((prevData) => ({ ...prevData, company: value }));
  };

  const handleJobTitleChange = (event) => {
    const value = event.target.value;

    if (value == 252) {
      setJobTitleInput(true);
    } else {
      setJobTitleInput(false);
    }

    setFormInput((prevData) => ({ ...prevData, job_title: value }));
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  //Sponsor Form Submission
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
        "First Name should only contain alphabets and spaces.";
    }

    if (
      formInput.last_name === "" ||
      /^\s*$/.test(formInput.last_name) ||
      formInput.last_name.length === 0
    ) {
      fieldErrors.last_name = "Last Name is required.";
    }

    if (
      formInput.official_email === "" ||
      /^\s*$/.test(formInput.official_email) ||
      formInput.official_email.length === 0
    ) {
      fieldErrors.official_email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formInput.official_email)) {
      fieldErrors.official_email = "Invalid email format.";
    } else if (formInput.official_email.length > 100) {
      fieldErrors.official_email = "Maximum 100 Characters Allowed in Email.";
    }

    if (formInput.phone_number === "") {
      if (
        /^\s*$/.test(formInput.phone_number) ||
        !/^\d{10}$/.test(formInput.phone_number)
      ) {
        fieldErrors.phone_number = "Invalid phone number. Must be 10 digits.";
      }
    }

    if (formInput.job_title === "" || /^\s*$/.test(formInput.job_title)) {
      fieldErrors.job_title = "Job Title is required.";
    } else if (formInput.job_title.length > 100) {
      fieldErrors.job_title = "Maximum 100 Characters Allowed in website.";
    }

    if (formInput.job_title_name !== "") {
      if (!/^[a-zA-Z\s]*$/.test(formInput.job_title_name)) {
        fieldErrors.designation_name =
          "Job Title should only contain alphabets and spaces.";
      } else if (formInput.job_title_name > 30) {
        fieldErrors.job_title_name = "Maximum 30 Characters Allowed.";
      }
    }

    if (
      formInput.company === "" ||
      /^\s*$/.test(formInput.company) ||
      formInput.company.length === 0
    ) {
      fieldErrors.company = "Company is required.";
    }

    if (formInput.company_name !== "") {
      if (formInput.company_name > 50) {
        fieldErrors.company_name = "Maximum 50 Characters Allowed.";
      }
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

    if (formInput.country === "") {
      fieldErrors.country = "Country is required.";
    }

    if (formInput.brand_name === "") {
      fieldErrors.brand_name = "Brand Name is required.";
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("event_id", formInput.event_id);
      formData.append("first_name", formInput.first_name);
      formData.append("last_name", formInput.last_name);
      formData.append("official_email", formInput.official_email);
      formData.append("phone_number", formInput.phone_number);
      formData.append("image", formInput.image);
      formData.append("job_title", formInput.job_title);
      formData.append("job_title_name", formInput.job_title_name);
      formData.append("industry", formInput.industry);
      formData.append("company", formInput.company);
      formData.append("company_name", formInput.company_name);
      formData.append("country", formInput.country);
      formData.append("website", formInput.website);
      formData.append("employee_size", formInput.employee_size);
      formData.append("linkedin_page_link", formInput.linkedin_page_link);
      formData.append("company_turn_over", formInput.company_turn_over);
      formData.append("brand_name", formInput.brand_name);

      axios
        .post(`/api/sponsors`, formData, {
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
              image: null,
              file: null,
            });

            setErrors({});
            // if (event_id > 0) {
            //   history.push(`/admin/all-events/${event_id}`);
            // } else {
            //   history.push(`/admin/sponsors`);
            // }
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            swal("All fields are mandatory", "", "error");

            // history.push(`/admin/all-events/${event_id}`);
          }
        });
    } else {
      setErrors(fieldErrors);
    }
    setIsLoading(false);
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
            <h1 className="h3 mb-0 text-gray-800">Add Member</h1>
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
              <i className="fa fa-solid fa-arrow-left"></i>
              &nbsp; Go Back
            </Link>
          </div>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Add Member</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-lg-12">
                <h5 className="text-center">Add Member Details</h5>
                <hr />
                <form
                  className="user mt-5"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  {/* Personal Details*/}
                  <fieldset className="mt-4">
                    <legend>Personal Details:</legend>

                    {/* Name */}

                    <div className="form-group row">
                      <div className="col-6">
                        <label forhtml="first_name">First Name</label>
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
                        <label forhtml="last_name">Last Name</label>
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

                    {/* Official Email  */}

                    <div className="form-group row">
                      <div className="col-6">
                        <label forhtml="email">Official Email</label>

                        <input
                          type="email"
                          className={`form-control ${
                            errors.official_email ? "is-invalid" : ""
                          }`}
                          placeholder="Email"
                          name="official_email"
                          value={formInput.official_email}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.official_email && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.official_email}
                          </div>
                        )}
                      </div>

                      <div className="col-6">
                        <label forhtml="phone_number">Phone Number</label>

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

                    {/* Job-Title */}
                    <div className="form-group row">
                      <div className="col-4">
                        <label forhtml="job_title">Job Title</label>

                        <select
                          className={`form-control ${
                            errors.job_title ? "is-invalid" : ""
                          }`}
                          name="job_title"
                          value={formInput.job_title}
                          onChange={handleJobTitleChange}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                          style={{ padding: "0.3rem 1rem", fontSize: "1rem" }}
                        >
                          <option value="">Select Job Title</option>
                          {designationData.length > 0 &&
                            designationData.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>

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

                        {jobTitleInput && (
                          <div className="mt-3">
                            <input
                              type="text"
                              className={`form-control  mb-3 ${
                                errors.job_title_name ? "is-invalid" : ""
                              }`}
                              placeholder="Job Title"
                              name="job_title_name"
                              value={formInput.job_title_name}
                              onChange={handleInput}
                              onBlur={handleBlur}
                              onFocus={handleInputFocus}
                            />
                            {errors.job_title_name && (
                              <div
                                className="invalid-feedback"
                                style={{
                                  textAlign: "left",
                                  padding: " 0px 1.2rem",
                                }}
                              >
                                {errors.job_title_name}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>Company Details:</legend>

                    {/* Company*/}
                    <div className="form-group row">
                      <div className="col-4">
                        <label forhtml="company">Company</label>

                        <select
                          className={`form-control ${
                            errors.company ? "is-invalid" : ""
                          }`}
                          name="company"
                          value={formInput.company}
                          onChange={handleCompanyChange}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                          style={{ padding: "0.3rem 1rem", fontSize: "1rem" }}
                        >
                          <option value="">Select Company</option>

                          {companyData.length > 0 &&
                            companyData.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                        {errors.company && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.company}
                          </div>
                        )}

                        {companyInput && (
                          <div className="mt-3">
                            <input
                              type="text"
                              className={`form-control mb-3 ${
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
                                  padding: " 0px 1.2rem",
                                }}
                              >
                                {errors.company_name}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/*  Industry */}
                      <div className="col-4">
                        <label forhtml="industry">Industry</label>

                        <select
                          className={`form-control ${
                            errors.industry ? "is-invalid" : ""
                          }`}
                          name="industry"
                          value={formInput.industry}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                          style={{ padding: "0.3rem 1rem", fontSize: "1rem" }}
                        >
                          <option value="">Select Industry</option>

                          {industryData.length > 0 &&
                            industryData.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
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

                      {/* Brand Name */}
                      <div className="col-4">
                        <label forhtml="brand_name">Brand Name</label>

                        <input
                          type="text"
                          className={`form-control ${
                            errors.brand_name ? "is-invalid" : ""
                          }`}
                          placeholder="Brand Name"
                          name="brand_name"
                          maxLength={8}
                          value={formInput.brand_name}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.brand_name && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.brand_name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Website  */}
                    <div className="form-group row">
                      <div className="col-4">
                        <label forhtml="website">Website</label>

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

                      {/* Linked Page Link  */}
                      <div className="col-8">
                        <label forhtml="linkedin_page_link">
                          LinkedIn Page Link
                        </label>

                        <input
                          type="linkedin_page_link"
                          className={`form-control ${
                            errors.linkedin_page_link ? "is-invalid" : ""
                          }`}
                          placeholder="Linked Page Link"
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

                    {/* Employee Size */}
                    <div className="form-group row">
                      <div className="col-4">
                        <label forhtml="employee_size">Employee Size</label>

                        <input
                          type="text"
                          className={`form-control ${
                            errors.employee_size ? "is-invalid" : ""
                          }`}
                          placeholder="Employee Size"
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

                      {/* Country */}
                      <div className="col-4">
                        <label forhtml="country">Country</label>

                        <input
                          type="text"
                          className={`form-control ${
                            errors.country ? "is-invalid" : ""
                          }`}
                          placeholder="Country"
                          name="country"
                          value={formInput.country}
                          onChange={handleInput}
                          onBlur={handleBlur}
                          onFocus={handleInputFocus}
                        />

                        {errors.country && (
                          <div
                            className="invalid-feedback"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            {errors.country}
                          </div>
                        )}
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
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddMember;
