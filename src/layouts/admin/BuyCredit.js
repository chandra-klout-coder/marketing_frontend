import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function BuyCredit() {
  const history = useHistory();

  const token = useSelector((state) => state.auth.token);

  const userId = localStorage.getItem("userId"); //admin

  const imageBaseUrl = process.env.REACT_APP_API_URL;

  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [formInput, setFormInput] = useState({
    totalPoints: 0,
    gst: 0,
    amount: 0,
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
      case "totalPoints":
        if (value !== "" && value < 0) {
          fieldErrors[name] = "Invalid Points.";
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
      formInput.totalPoints !== "" &&
      formInput.totalPoints != null &&
      formInput.totalPoints < 0
    ) {
      if (/^\s*$/.test(formInput.totalPoints)) {
        fieldErrors.totalPoints = "Invalid number. Must be digits.";
      }
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("totalPoints", formInput.totalPoints);
      formData.append("amount", formInput.amount);
      formData.append("gst", formInput.gst);
      formData.append("userId", userId);

      console.log("data", formData);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      axios
        .post(`/user/buyCredits`, formData, {
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
              totalPoints: "",
              amount: 0,
              gst: 0,
            });

            setErrors({});

            history.push(`/admin/buy-credits/${userId}`);
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
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
            <h1 className="h3 mb-0 text-gray-800">Buy Credits</h1>
            <Link
              to={`/admin/dashboard`}
              className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
              style={{
                backgroundColor: "#F5007E",
                borderColor: "#F5007E",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go To
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="row p-1">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Buy Credits</h6>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <form
                    className="user"
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                  >
                    {/* Benefits */}
                    <div className="form-group row">
                      <div className="col-12 mb-3 mb-sm-0">
                        <h6>
                          {" "}
                          Get the Klout Credits for the following benefits and
                          help your business grow -
                        </h6>

                        <ul>
                          <li>
                            {" "}
                            <i class="fa fa-solid fa-circle-dot"></i>
                            Connect with the right decision maers in companies.
                          </li>
                          <li> Conclude your conversations with an outcome.</li>
                          <li>
                            Get to know who your sales team is connecting with
                            in the app.
                          </li>
                          <li>
                            Check the sales teams connects, chats and contacts
                            viewed.
                          </li>
                          <li>
                            Your sales teams gets access connects to other
                            suitable users.
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Plan Details */}
                    <div className="form-group row">
                      <div className="col-12 mb-3 mb-sm-0">
                        <h6>
                          <strong>
                            Cost of Each credit will be INR 100 /- and validity
                            will be 90 days from the day of purchase.
                          </strong>
                        </h6>
                      </div>
                    </div>

                    {/* Credit Points  */}
                    <div className="form-group row">
                      <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                        <label forhtml="totalPoints" className="col-form-label">
                          Number of Credits to purchase
                        </label>
                        <div className="form-group">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.totalPoints ? "is-invalid" : ""
                            }`}
                            placeholder="Total Points"
                            name="totalPoints"
                            maxLength={10}
                            value={
                              formInput.totalPoints === null
                                ? ""
                                : formInput.totalPoints
                            }
                            onChange={handleInput}
                            onBlur={handleBlur}
                            onFocus={handleInputFocus}
                          />

                          {errors.totalPoints && (
                            <div
                              className="invalid-feedback"
                              style={{
                                textAlign: "left",
                              }}
                            >
                              {errors.totalPoints}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount  */}
                    <div className="form-group row">
                      <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                        <label forhtml="amount" className="col-form-label">
                          Credit Cost (amount in INR)
                        </label>
                        <div className="form-group">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.amount ? "is-invalid" : ""
                            }`}
                            placeholder="0"
                            name="amount"
                            readOnly
                            maxLength={10}
                            value={
                              formInput.amount === null ? "" : formInput.amount
                            }
                            onChange={handleInput}
                            onBlur={handleBlur}
                            onFocus={handleInputFocus}
                          />
                        </div>
                      </div>
                    </div>

                    {/* GST  */}
                    <div className="form-group row">
                      <div className="col-12 col-lg-6 mb-3 mb-sm-0">
                        <label forhtml="gst" className="col-form-label">
                          GST (@18% of Credit Cost)
                        </label>
                        <div className="form-group">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.gst ? "is-invalid" : ""
                            }`}
                            placeholder="0"
                            name="gst"
                            readOnly
                            maxLength={10}
                            value={formInput.gst === null ? "" : formInput.gst}
                            onChange={handleInput}
                            onBlur={handleBlur}
                            onFocus={handleInputFocus}
                          />
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
                          {"Pay "} {formInput.amount}
                        </button>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-8 mb-3 mb-sm-0">
                        <p>
                          <strong>
                            {" "}
                            Purchase Invoice will be generated and sent to the
                            registered email id post transaction is done.
                          </strong>
                        </p>
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

export default BuyCredit;
