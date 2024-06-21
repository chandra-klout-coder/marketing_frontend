import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function AllocatedPoints() {
  const history = useHistory();

  const userId = useParams().id;

  const token = useSelector((state) => state.auth.token);

  const AllocatedPointsByUserId = localStorage.getItem("userId"); //admin

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [formInput, setFormInput] = useState({
    allocatedPoints: 0,
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
      case "allocatedPoints":
        if (value !== "" && value < 0) {
          fieldErrors[name] = "Invalid Number.";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldErrors = {};

    if (
      formInput.allocatedPoints !== "" &&
      formInput.allocatedPoints != null &&
      formInput.allocatedPoints < 0
    ) {
      if (/^\s*$/.test(formInput.allocatedPoints)) {
        fieldErrors.allocatedPoints = "Invalid number. Must be digits.";
      }
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("allocatedPoints", formInput.allocatedPoints);
      formData.append("AllocatedPointsByUserId", AllocatedPointsByUserId);
      formData.append("userId", userId);

      axios
        .post(`/user/allocatePoints`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
          },
        })
        .then((res) => {

          if (res.data.status === true) {

            swal("Success", res.data.message, "success");

            setFormInput({
              ...formInput,
              allocatedPoints: "",
            });

            setErrors({});

            history.push(`/admin/allocate-points/${userId}`);
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
          } else if (res.data.status === false) {
            swal("Error", res.data.message, "error");
            history.push(`/admin/add-member`);
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
            <h1 className="h3 mb-0 text-gray-800">Allocate Points </h1>
            <Link
              to={`/admin/connects`}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
            </Link>
          </div>
        </div>
      </div>

      <div className="row p-3">
        <div className="col-8">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Allocate Points
              </h6>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <form
                    className="user"
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                  >
                    {/* allocatedPoints  */}
                    <div className="form-group row">
                      <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                        <label
                          forhtml="allocatedPoints"
                          className="col-form-label"
                        >
                          Allocated Points
                        </label>
                        <div className="form-group">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.allocatedPoints ? "is-invalid" : ""
                            }`}
                            placeholder="Allocated Points"
                            name="allocatedPoints"
                            maxLength={10}
                            value={
                              formInput.allocatedPoints === null
                                ? ""
                                : formInput.allocatedPoints
                            }
                            onChange={handleInput}
                            onBlur={handleBlur}
                            onFocus={handleInputFocus}
                          />

                          {errors.allocatedPoints && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.allocatedPoints}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-8 mb-3 mb-sm-0">
                        <button
                          className="btn btn-primary btn-user"
                          style={{
                            backgroundColor: "#F5007E",
                            borderColor: "#F5007E",
                            fontSize: "14px",
                            padding: "1% 4%",
                          }}
                        >
                          {"Allocate Points Now"}
                        </button>
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

export default AllocatedPoints;
