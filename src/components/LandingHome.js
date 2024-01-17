import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import QrCode from "./../assets/img/qr.svg";
import Logo from "./../assets/img/Klout-Club.svg";
// import Logo from "./../assets/img/klout_original_logo.jpg";
import Author1 from "./../assets/img/author/author1.jpg";
import Author2 from "./../assets/img/author/author2.jpg";
import MockUp from "./../assets/img/hand_mockup_new.png";
import Showcase from "./../assets/img/Find_professionals_near_you.png";
import ShowcaseFour from "./../assets/img/Network_at_business_events.png";
import ShowcaseTwo from "./../assets/img/Find_industry_wise_professionals.png";
import ShowcaseThree from "./../assets/img/Attend_events_as_per_your_liking.png";

import "./CardWithHover.css";

import { Link } from "react-router-dom";

import loadingGif from "../assets/images/load.gif";

const Home2 = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    phone: "",
    email: "",
    message: "",
  });

  const [semail, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e) => {
    e.persist();

    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    switch (name) {
      case "name":
        if (value === "") {
          fieldErrors[name] = "Name is required.";
        } else if (value.length > 50) {
          fieldErrors[name] = "Maximum 50 Characters Allowed.";
        }
        break;

      case "subject":
        if (value === "") {
          fieldErrors[name] = "Subject is required.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed.";
        }
        break;

      case "email":
        if (value === "") {
          fieldErrors[name] = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors[name] = "Invalid email format.";
        } else if (value.length > 100) {
          fieldErrors[name] = "Maximum 100 Characters Allowed in Email.";
        }
        break;

      case "phone":
        if (value === "") {
          fieldErrors[name] = "Phone. is required.";
        } else if (!/^\d{10}$/.test(value)) {
          fieldErrors[name] = "Invalid phone. Must be 10 digits.";
        }
        break;

      case "message":
        if (value === "") {
          fieldErrors[name] = "Message is required.";
        } else if (value.length > 1000) {
          fieldErrors[name] = "Maximum 1000 Characters Allowed.";
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
    setFormData((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    // e.target.classNameList.remove("is-invalid");
  };

  const handleNext = async (e) => {
    e.preventDefault();

    const fieldErrors = {};

    if (formData.name === "") {
      fieldErrors.name = "Name is required.";
    } else if (formData.name.length > 100) {
      fieldErrors.name = "Maximum 100 Characters Allowed.";
    }

    if (formData.subject === "" || /^\s*$/.test(formData.subject)) {
      fieldErrors.subject = "Subject is required.";
    } else if (formData.subject.length > 100) {
      fieldErrors.subject = "Maximum 100 Characters Allowed.";
    }

    if (formData.email === "" || /^\s*$/.test(formData.email)) {
      fieldErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      fieldErrors.email = "Invalid email format.";
    } else if (formData.email.length > 100) {
      fieldErrors.email = "Maximum 100 Characters Allowed in Email.";
    }

    if (formData.phone === "" || /^\s*$/.test(formData.phone)) {
      fieldErrors.phone = "Phone No. is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      fieldErrors.phone = "Invalid phone number. Must be 10 digits.";
    }

    if (formData.message === "") {
      fieldErrors.message = "Message is required.";
    } else if (formData.message.length > 1000) {
      fieldErrors.message = "Maximum 1000 Characters Allowed.";
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      await axios
        .post(`/api/contact-us`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");
            setFormData({
              name: "",
              subject: "",
              phone: "",
              email: "",
              message: "",
            });
          } else if (res.data.status === 422) {
            setErrors(res.data.error);
          }
        });
    } else {
      setErrors(fieldErrors);
    }

    setIsLoading(false);
  };

  const handleSubscriberBlur = (e) => {
    const { name, value } = e.target;
    const validationErrors = { ...errors };

    switch (name) {
      case "semail":
        if (!value) {
          validationErrors.semail = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          validationErrors.semail = "Invalid Email";
        } else {
          validationErrors.semail = "";
        }
        break;
      default:
        break;
    }
    setErrors(validationErrors);
  };

  const handleSubscriberSubmit = (e) => {
    e.preventDefault();

    let hasErrors = false;
    const validationErrors = { ...errors };

    if (!semail) {
      validationErrors.semail = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(semail)) {
      validationErrors.semail = "Invalid Email";
      hasErrors = true;
    } else {
      validationErrors.semail = "";
      hasErrors = false;
    }

    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    if (semail != "") {
      axios
        .post("/api/subscribe", {
          semail,
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");
            setEmail("");
          } else if (res.data.status === 201) {
            swal("Warning", res.data.error, "warning");
            setEmail("");
          } else {
            setErrors(res.data.message);
            swal("Warning", res.data.message, "warning");
            setEmail("");
          }
        });
    }

    setIsLoading(false);
  };

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const titles = [
    "Find decision makers ",
    "Connect to network easily",
    "Get introduced to people in events",
  ];

  const [bannerTitleIndex, setBannerTitleIndex] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBannerTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [bannerTitleIndex, titles.length]);

  const [isHoveredOne, setIsHoveredOne] = useState(false);

  const handleHoverOne = () => {
    setIsHoveredOne(true);
  };

  const handleMouseLeaveOne = () => {
    setIsHoveredOne(false);
  };

  const [isHoveredTwo, setIsHoveredTwo] = useState(false);

  const handleHoverTwo = () => {
    setIsHoveredTwo(true);
  };

  const handleMouseLeaveTwo = () => {
    setIsHoveredTwo(false);
  };

  const [isHoveredThree, setIsHoveredThree] = useState(false);

  const handleHoverThree = () => {
    setIsHoveredThree(true);
  };

  const handleMouseLeaveThree = () => {
    setIsHoveredThree(false);
  };

  const [isHoveredFour, setIsHoveredFour] = useState(false);

  const handleHoverFour = () => {
    setIsHoveredFour(true);
  };

  const handleMouseLeaveFour = () => {
    setIsHoveredFour(false);
  };

  const [isHoveredFive, setIsHoveredFive] = useState(false);

  const handleHoverFive = () => {
    setIsHoveredFive(true);
  };

  const handleMouseLeaveFive = () => {
    setIsHoveredFive(false);
  };

  const [isHoveredSix, setIsHoveredSix] = useState(false);

  const handleHoverSix = () => {
    setIsHoveredSix(true);
  };

  const handleMouseLeaveSix = () => {
    setIsHoveredSix(false);
  };

  return (
    <div className="home_container">
      <header className="header sticky">
        <div className="container">
          <div className="row flexbox-center">
            <div className="col-lg-2 col-md-3 col-6">
              <div className="logo">
                <a href="#home">
                  <img src={Logo} alt="logo" style={{ height: "28px" }} />
                </a>
              </div>
            </div>
            <div className="col-lg-10 col-md-9 col-6">
              <div className="responsive-menu">
                <div className="slicknav_menu">
                  <a
                    href="#"
                    onClick={toggleVisibility}
                    aria-haspopup="true"
                    role="button"
                    tabIndex="0"
                    className="slicknav_btn slicknav_collapsed"
                    style={{ outline: "none" }}
                  >
                    <span className="slicknav_menutxt">MENU</span>
                    <span className="slicknav_icon">
                      <span className="slicknav_icon-bar"></span>
                      <span className="slicknav_icon-bar"></span>
                      <span className="slicknav_icon-bar"></span>
                    </span>
                  </a>

                  {isVisible && (
                    <ul
                      className="slicknav_nav slicknav_hidden"
                      aria-hidden="true"
                      role="menu"
                      style={{ display: isVisible ? "block" : "none" }}
                    >
                      <li>
                        <a
                          className="nav-link active"
                          href="#home"
                          role="menuitem"
                          tabIndex="-1"
                        >
                          Home
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-link"
                          href="#feature"
                          role="menuitem"
                          tabIndex="-1"
                        >
                          Feature
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-link"
                          href="#download"
                          role="menuitem"
                          tabIndex="-1"
                        >
                          Download
                        </a>
                      </li>
                      <li>
                        <Link
                          className="appao-btn"
                          to="/login"
                          role="menuitem"
                          tabIndex="-1"
                        >
                          Login Now
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              <div className="mainmenu">
                <ul id="primary-menu">
                  <li>
                    <a className="nav-link active" href="#home">
                      Home
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="#feature">
                      Feature
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="#download">
                      Download
                    </a>
                  </li>
                  <li>
                    <Link className="appao-btn" to="/login">
                      Login Now
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* <!-- Hero Area --> */}
      <section className="hero-area" id="home">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="hero-area-content">
                <h1>{titles[bannerTitleIndex]}</h1>
                <p>
                  Connect with founders and C-level executives to accumulate
                  Social Capital points <br />
                  by mutually assisting one another, receiving support at every
                  stage from those <br />
                  who have traversed similar paths before you.
                </p>
                <a href="#" className="appao-btn">
                  Google Play
                </a>
                <a href="#" className="appao-btn">
                  App Store
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hand-mockup text-lg-left text-center">
                <img src={MockUp} alt="Hand Mockup" style={{ width: "86%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- About Klout --> */}
      {/* <section className="about-area ptb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="sec-title">
                <h2>
                  About Klout Club
                  <span className="sec-title-border">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="single-about-box">
                <i className="icofont icofont-ruler-pencil"></i>
                <h4>Find Decision Makers</h4>
                <ul style={{ textAlign: "left" }}>
                  <li>• Meet inspiring professional.</li>
                  <li>
                    • Meet new business professional, get meetings, drive
                    conversations.
                  </li>
                  <li>• Seize the opportunities that come your way</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="single-about-box active">
                <i className="icofont icofont-computer"></i>
                <h4>Connect and Network</h4>
                <ul style={{ textAlign: "left" }}>
                  <li>• Meet inspiring professional.</li>
                  <li>
                    • Meet new business professional, get meetings, drive
                    conversations.
                  </li>
                  <li>• Seize the opportunities that come your way</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="single-about-box">
                <i className="icofont icofont-headphone-alt"></i>
                <h4>Your meeting awaits</h4>
                <ul style={{ textAlign: "left" }}>
                  <li>
                    • Get introduced to the person in conclaves and events.
                  </li>
                  <li>
                    • Get an introduction, start the conversion and then get a
                    meeting.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <!-- Features --> */}
      <section className="feature-area ptb-90" id="feature">
        ``
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="sec-title">
                <h2 className="mt-4 mb-4 text-center text-white">
                  How Klout can help you
                </h2>
                <p className="text-white">
                  Klout helped 110k+ people all over the globe solve their tacks
                  with the power of networking.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4 mt-2 ">
                  {/* <a href=""> */}
                  <div
                    className="card"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "rgb(198, 245, 255)",
                    }}
                    onMouseEnter={handleHoverOne}
                    onMouseLeave={handleMouseLeaveOne}
                  >
                    <div className="card-body">
                      <div
                        className="card-img"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          backgroundColor: "rgb(7 92 170)",
                        }}
                      >
                        <img src="" alt="" />
                      </div>

                      <h1
                        className="card-title mb-1 flex"
                        style={{ marginTop: "5%", fontSize: "1.5rem" }}
                      >
                        Get New customer
                      </h1>
                      {/* {isHoveredOne && ( */}
                      <p
                        className={`paragraph ${
                          isHoveredOne ? "visible" : "hide"
                        }`}
                      >
                        Seamlessly integrate targeted strategies and insights,
                        empowering your business to thrive in acquiring fresh,
                        valuable clientele.
                      </p>
                      {/* )} */}
                      {/* <a href="#" className="card-link">
                          <i className="fa fa-arrow-right"></i>
                        </a> */}
                    </div>
                  </div>
                  {/* </a> */}
                </div>

                <div className="col-md-4 mt-2">
                  {/* <a href=""> */}
                  <div
                    className="card"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "rgb(255, 219, 245)",
                    }}
                    onMouseEnter={handleHoverTwo}
                    onMouseLeave={handleMouseLeaveTwo}
                  >
                    <div className="card-body">
                      <div
                        className="card-img"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          backgroundColor: "white",
                        }}
                      >
                        <img src="" alt="" />
                      </div>

                      <h1
                        className="card-title mb-1 flex"
                        style={{ marginTop: "5%", fontSize: "1.4rem" }}
                      >
                        Connect with like minded people
                      </h1>
                      {/* {isHoveredTwo && ( */}
                      <p
                        className={`paragraph ${
                          isHoveredTwo ? "visible" : "hide"
                        }`}
                      >
                        Cultivate a community that fosters collaboration,
                        knowledge exchange, and lasting relationships within
                        your niche.
                      </p>
                      {/* )} */}
                      {/* <a href="#" className="card-link">
                          <i className="fa fa-arrow-right"></i>
                        </a> */}
                    </div>
                  </div>
                  {/* </a> */}
                </div>

                <div className="col-md-4 mt-2">
                  {/* <a href=""> */}
                  <div
                    className="card"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "rgb(240, 233, 222)",
                    }}
                    onMouseEnter={handleHoverThree}
                    onMouseLeave={handleMouseLeaveThree}
                  >
                    <div className="card-body">
                      <div
                        className="card-img"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          backgroundColor: "#2f937b",
                        }}
                      >
                        <img src="" alt="" />
                      </div>

                      <h1
                        className="card-title mb-1 flex"
                        style={{ marginTop: "5%", fontSize: "1.5rem" }}
                      >
                        Find Professionals near you
                      </h1>
                      {/* {isHoveredThree && ( */}
                      <p
                        className={`paragraph ${
                          isHoveredThree ? "visible" : "hide"
                        }`}
                      >
                        Unlock valuable networking opportunities, fostering
                        meaningful connections and collaborations right in your
                        vicinity.
                      </p>
                      {/* // )} */}
                      {/* <a href="#" className="card-link">
                          <i className="fa fa-arrow-right"></i>
                        </a> */}
                    </div>
                  </div>
                  {/* </a> */}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4 mt-4">
                  {/* <a href="javascript:void()"> */}
                  <div
                    className="card"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "rgb(229, 232, 255)",
                    }}
                    onMouseEnter={handleHoverFour}
                    onMouseLeave={handleMouseLeaveFour}
                  >
                    <div className="card-body">
                      <div
                        className="card-img"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          backgroundColor: "#ef9560",
                        }}
                      >
                        <img src="" alt="" />
                      </div>

                      <h1
                        className="card-title mb-1 flex"
                        style={{ marginTop: "5%", fontSize: "1.5rem" }}
                      >
                        Find a perfect co-founder
                      </h1>
                      {/* {isHoveredFour && ( */}
                      <p
                        className={`paragraph ${
                          isHoveredFour ? "visible" : "hide"
                        }`}
                      >
                        Elevate your entrepreneurial journey by building a
                        synergistic partnership that propels your business to
                        new heights.
                      </p>
                      {/* )} */}
                      {/* <a href="#" className="card-link">
                          <i className="fa fa-arrow-right"></i>
                        </a> */}
                    </div>
                  </div>
                  {/* </a> */}
                </div>

                <div className="col-md-4 mt-4">
                  {/* <a href=""> */}
                  <div
                    className="card"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "rgb(255, 235, 187)",
                    }}
                    onMouseEnter={handleHoverFive}
                    onMouseLeave={handleMouseLeaveFive}
                  >
                    <div className="card-body">
                      <div
                        className="card-img"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          backgroundColor: "#2f937b",
                        }}
                      >
                        <img src="" alt="" />
                      </div>

                      <h1
                        className="card-title mb-1 flex"
                        style={{ marginTop: "5%", fontSize: "1.5rem" }}
                      >
                        Find the trusted mentor
                      </h1>
                      {isHoveredFive && (
                        <p
                          className={`paragraph ${
                            isHoveredFive ? "visible" : "hide"
                          }`}
                        >
                          Cultivate mentorship relationships that foster career
                          development ensuring a path to success with trusted
                          support.
                        </p>
                      )}
                      {/* <a href="#" className="card-link">
                          <i className="fa fa-arrow-right"></i>
                        </a> */}
                    </div>
                  </div>
                  {/* </a> */}
                </div>

                {/* <div className="col-md-4 mt-4">
                  <a href="">
                    <div
                      className="card"
                      style={{
                        borderRadius: "12px",
                        backgroundColor: "rgb(196, 255, 175)",
                      }}
                      onMouseEnter={handleHoverSix}
                      onMouseLeave={handleMouseLeaveSix}
                    >
                      <div className="card-body">
                        <div
                          className="card-img"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                          }}
                        >
                          <img src="" alt="" />
                        </div>

                        <h5
                          className="card-title mb-1 flex"
                          style={{ marginTop: "35%" }}
                        >
                          Get Recommended for New Customers
                        </h5>
                        {isHoveredSix && <p></p>}
                        <a href="#" className="card-link">
                          <i className="fa fa-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </a>
                </div> */}
              </div>
            </div>
          </div>

          {/* <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4 mt-4">
                  <a href="">
                    <div
                      className="card"
                      style={{
                        borderRadius: "12px",
                        backgroundColor: "rgb(229, 245, 209)",
                      }}
                    >
                      <div className="card-body">
                        <div
                          className="card-img"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                          }}
                        >
                          <img src="" alt="" />
                        </div>

                        <h5
                          className="card-title mb-1 flex"
                          style={{ marginTop: "35%" }}
                        >
                          Get Recommended for New Customers
                        </h5>
                        <a href="#" className="card-link">
                          <i className="fa fa-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="col-md-4 mt-4">
                  <a href="">
                    <div
                      className="card"
                      style={{
                        borderRadius: "12px",
                        backgroundColor: "rgb(211, 233, 254)",
                      }}
                    >
                      <div className="card-body">
                        <div
                          className="card-img"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                          }}
                        >
                          <img src="" alt="" />
                        </div>

                        <h5
                          className="card-title mb-1 flex"
                          style={{ marginTop: "35%" }}
                        >
                          Get Recommended for New Customers
                        </h5>
                        <a href="#" className="card-link">
                          <i className="fa fa-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="col-md-4 mt-4">
                  <a href="">
                    <div
                      className="card"
                      style={{
                        borderRadius: "12px",
                        backgroundColor: "rgb(251, 216, 216)",
                      }}
                    >
                      <div className="card-body">
                        <div
                          className="card-img"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                          }}
                        >
                          <img src="" alt="" />
                        </div>

                        <h5
                          className="card-title mb-1 flex"
                          style={{ marginTop: "35%" }}
                        >
                          Get Recommended for New Customers
                        </h5>
                        <a href="#" className="card-link">
                          <i className="fa fa-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* <!-- Video Introduction --> */}
      <section
        className="video-introduction-area ptb-90"
        style={{ background: "#efefef" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div>
                <div className="">
                  <iframe
                    src="https://www.youtube.com/embed/SMB6lWGGVwc"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style={{
                      width: "100%",
                      aspectRatio: "72 / 45",
                      marginBottom: "40px",
                      borderRadius: "18px / 20px",
                    }}
                  ></iframe>
                  <div>
                    <h2 className="mt-4 mb-4 text-center">Why Klout Club</h2>
                    <p className="mb-1">
                      The Klout Club app empowers users to cultivate a dynamic
                      network by connecting with like-minded individuals,
                      mentors, and potential co-founders.
                    </p>
                    <p className="mb-1">
                      Its innovative features, such as &nbsp;
                      <span style={{ fontWeight: "700" }}>
                        {" "}
                        "Meet Professionals Near You"
                      </span>{" "}
                      &nbsp; and &nbsp;
                      <span style={{ fontWeight: "700" }}>
                        "Connect with Like - minded People"
                      </span>{" "}
                      &nbsp; facilitate seamless networking, helping users gain
                      Social Capital points for mutual support and fostering
                      collaborative relationships that contribute to their
                      professional success.
                    </p>

                    {/* <ol style={{ paddingLeft: "14px" }}>
                      <li>
                        Say goodbye to cold outreach — just post your business
                        request on Intch and the app &nbsp;
                        <span style={{ fontWeight: "700" }}>
                          will match it with the relevant people.
                        </span>
                        &nbsp;
                      </li>
                      <li>
                        &nbsp;{" "}
                        <span style={{ fontWeight: "700" }}>
                          Earn Social Capital points
                        </span>
                        &nbsp; for helping others with their requests: introduce
                        someone who can help or share your expertise and support
                        it with a personal story.
                      </li>
                      <li>
                        Use Social Capital to get more replies to your requests
                        and &nbsp;{" "}
                        <span style={{ fontWeight: "700" }}>
                          get in touch with more awesome people.
                        </span>
                        &nbsp;
                      </li>
                    </ol> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- User Feedback --> */}
      {/* <section className="testimonial-area ptb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="sec-title">
                <h2>
                  User Feedback
                  <span className="sec-title-border">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </h2>
              
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="testimonial-wrap">
                <div className="single-testimonial-box">
                  <div className="author-img">
                    <img src={Author1} alt="author" />
                  </div>
                  <h5>Mary Balogh</h5>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in
                  </p>
                  <div className="author-rating">
                    <i className="icofont icofont-star"></i>
                    <i className="icofont icofont-star"></i>
                    <i className="icofont icofont-star"></i>
                    <i className="icofont icofont-star"></i>
                    <i className="icofont icofont-star"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <!-- Video --> */}
      {/* <section className="video-area ptb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="video-popup">
                <a
                  href="https://www.youtube.com/watch?v=RZXnugbhw_4"
                  className="popup-youtube"
                >
                  <i className="icofont icofont-ui-play"></i>
                </a>
                <h1>Watch Video Demo</h1>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <!-- Showcase --> */}
      <section className="showcase-area ptb-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="sec-title">
                <h2>
                  How it works
                  <span className="sec-title-border">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </h2>
                {/* <!-- <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                    eiusmod tempor incididunt
                  </p> --> */}
              </div>
            </div>
          </div>

          <div className="row flexbox-center">
            <div className="col-lg-6">
              <div className="single-showcase-box">
                <h4>Find professionals near you</h4>
                <p>
                  With its proprietary map feature Klout Club App helps you to
                  find professionals near you. So the next time you are at an
                  airport or at a office park you can find professionals near
                  you to network and connect with.
                </p>
                {/* <a href="#" className="appao-btn appao-btn2">
                  Read More
                </a> */}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="single-showcase-box">
                <img src={Showcase} alt="showcase" />
              </div>
            </div>
          </div>

          <div className="row flexbox-center">
            <div className="col-lg-6">
              <div className="single-showcase-box">
                <img src={ShowcaseTwo} alt="showcase" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="single-showcase-box">
                <h4>Find industry wise professionals</h4>
                <p>
                  Use our advanced search feature to find professionals from
                  your desired industries and companies.
                </p>
                {/* <a href="#" className="appao-btn appao-btn2">
                  Read More
                </a> */}
              </div>
            </div>
          </div>

          <div className="row flexbox-center">
            <div className="col-lg-6">
              <div className="single-showcase-box">
                <h4>Attend events as per your liking </h4>
                <p>
                  From our list of events find the one you prefer to attend and
                  ask for an invite. If you are near any event location, you can
                  also walkin and scan the QR to attend the event.
                </p>
                {/* <a href="#" className="appao-btn appao-btn2">
                  Read More
                </a> */}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="single-showcase-box">
                <img src={ShowcaseThree} alt="showcase" />
              </div>
            </div>
          </div>

          <div className="row flexbox-center">
            <div className="col-lg-6">
              <div className="single-showcase-box">
                <img src={ShowcaseFour} alt="showcase" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="single-showcase-box">
                <h4>Network at business events</h4>
                <p>
                  Klout Club app makes it easier for you to network at business
                  conclaves and events.
                </p>
                {/* <a href="#" className="appao-btn appao-btn2">
                  Read More
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Counter --> */}
      <section className="counter-area ptb-90">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <div className="single-counter-box">
                <i className="icofont icofont-heart-alt"></i>
                <h1>
                  <span className="counter">10</span>
                </h1>
                <p>Happy Clients</p>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="single-counter-box">
                <i className="icofont icofont-protect"></i>
                <h1>
                  <span className="counter">108</span>
                </h1>
                <p>Completed Events</p>
              </div>
            </div>
            {/* <div className="col-md-3 col-sm-6">
              <div className="single-counter-box">
                <i className="icofont icofont-download-alt"></i>
                <h1>
                  <span className="counter">1</span>K
                </h1>
                <p>Apps Download</p>
              </div>
            </div> */}
            {/* <div className="col-md-3 col-sm-6">
              <div className="single-counter-box">
                <i className="icofont icofont-trophy"></i>
                <h1>
                  <span className="counter">25</span>
                </h1>
                <p>Our Awards</p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* <!-- Download --> */}
      <section
        className="download-area ptb-90"
        id="download"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="sec-title">
                <h2>
                  Download Available
                  <span className="sec-title-border">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </h2>
                <p></p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <ul>
                <li>
                  <a
                    href="#"
                    className="download-btn flexbox-center"
                    style={{ background: "black", textDecoration: "none" }}
                  >
                    <div className="download-btn-icon">
                      <i className="icofont icofont-brand-android-robot"></i>
                    </div>
                    <div className="download-btn-text">
                      <p style={{ marginBottom: "0rem" }}>Available on</p>
                      <h4>Android Store</h4>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="download-btn flexbox-center"
                    style={{ background: "black", textDecoration: "none" }}
                  >
                    <div className="download-btn-icon">
                      <i className="icofont icofont-brand-apple"></i>
                    </div>
                    <div className="download-btn-text">
                      <p style={{ marginBottom: "0rem" }}>Available on</p>
                      <h4>Apple Store</h4>
                    </div>
                  </a>
                </li>
                {/* <!-- <li>
                    <a href="#" className="download-btn flexbox-center">
                      <div className="download-btn-icon">
                        <i className="icofont icofont-brand-windows"></i>
                      </div>
                      <div className="download-btn-text">
                        <p>Available on</p>
                        <h4>Windows Store</h4>
                      </div>
                    </a>
                  </li> --> */}
              </ul>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="sec-title mt-4">
                <p>Or scan this QR code to download the app</p>

                <ul className="mt-4">
                  <li>
                    <a href="#" className="flexbox-center">
                      <div className="download-btn-icon">
                        {/* <!-- <i className="icofont icofont-brand-android-robot"></i>
                           --> */}
                      </div>
                      <div className="download-btn-text">
                        <img src={QrCode} alt="QR" width="50%" />
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Footer --> */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="contact-form">
                <h4>Get in Touch</h4>
                <p className="form-message"></p>
                <form onSubmit={handleNext} method="post">
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control form-control-user ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      placeholder="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                      style={{ marginBottom: "0px" }}
                    />

                    {errors.name && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                          padding: " 0px",
                        }}
                      >
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      className={`form-control form-control-user ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                      style={{ marginBottom: "0px" }}
                    />
                    {errors.email && (
                      <div
                        className="invalid-feedback"
                        style={{ textAlign: "left", padding: " 0px" }}
                      >
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control form-control-user ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      placeholder="Phone Number"
                      name="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                      style={{ marginBottom: "0px" }}
                    />
                    {errors.phone && (
                      <div
                        className="invalid-feedback"
                        style={{ textAlign: "left", padding: "0px" }}
                      >
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control form-control-user ${
                        errors.subject ? "is-invalid" : ""
                      }`}
                      placeholder="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                      style={{ marginBottom: "0px" }}
                    />

                    {errors.subject && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                          padding: " 0px",
                        }}
                      >
                        {errors.subject}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <textarea
                      placeholder="Your Message"
                      name="message"
                      className={`form-control form-control-user ${
                        errors.message ? "is-invalid" : ""
                      }`}
                      rows={1}
                      value={formData.message}
                      onChange={handleInput}
                      onBlur={handleBlur}
                      onFocus={handleInputFocus}
                      style={{ marginBottom: "0px" }}
                    ></textarea>
                    {errors.message && (
                      <div
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                          padding: " 0px",
                        }}
                      >
                        {errors.message}
                      </div>
                    )}
                  </div>

                  <button type="submit">Send Message</button>
                </form>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contact-address">
                <h4>Address</h4>
                <p>
                  10, Poorvi Marg, Dlf Phase 2, Gurgaon, Haryana (India) -
                  122008
                </p>
                <ul style={{ paddingLeft: "0" }}>
                  <li>
                    <div className="contact-address-icon">
                      <i className="icofont icofont-headphone-alt"></i>
                    </div>
                    <div className="contact-address-info">
                      <a
                        href="tel:+91-96433 14331"
                        style={{ textDecoration: "none" }}
                      >
                        +91-96433 14331
                      </a>
                      {/* <a
                        href="tel:+8800000001"
                        style={{ textDecoration: "none" }}
                      >
                        +8800000001
                      </a> */}
                    </div>
                  </li>
                  <li>
                    <div className="contact-address-icon">
                      <i className="icofont icofont-envelope"></i>
                    </div>
                    <div className="contact-address-info">
                      <a
                        href="mailto:value@klout.club"
                        style={{ textDecoration: "none" }}
                      >
                        value@klout.club
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className="contact-address-icon">
                      <i className="icofont icofont-web"></i>
                    </div>
                    <div className="contact-address-info">
                      <a
                        href="www.klout.club"
                        style={{ textDecoration: "none" }}
                      >
                        www.klout.club
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="subscribe-form">
                <form onSubmit={handleSubscriberSubmit} method="post">
                  <>
                    {" "}
                    <input
                      type="text"
                      placeholder="Your email address here"
                      value={semail}
                      onBlur={handleBlur}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit">Subcribe</button>
                    {errors.semail && (
                      <p
                        className="invalid-feedback"
                        style={{
                          textAlign: "left",
                          padding: " 0px 1.2rem",
                        }}
                      >
                        {errors.semail}
                      </p>
                    )}
                  </>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="copyright-area">
                <ul>
                  <li>
                    <a
                      href="https://facebook.com/thekloutclub"
                      style={{ textDecoration: "none" }}
                      target="_blank"
                    >
                      <i className="icofont icofont-social-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com/TheKloutClub"
                      style={{ textDecoration: "none" }}
                      target="_blank"
                    >
                      <i className="icofont icofont-social-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/klout-club/"
                      style={{ textDecoration: "none" }}
                      target="_blank"
                    >
                      <i className="icofont icofont-brand-linkedin"></i>
                    </a>
                  </li>
                  {/* <li>
                    <a href="#" style={{ textDecoration: "none" }}>
                      <i className="icofont icofont-social-pinterest"></i>
                    </a>
                  </li> */}
                  {/* <li>
                    <a href="#" style={{ textDecoration: "none" }}>
                      <i className="icofont icofont-social-google-plus"></i>
                    </a>
                  </li> */}
                </ul>
                <p>
                  Copyright &copy; 2024-25 All rights reserved | The Klout Club
                  is made with &nbsp;
                  <i className="fa fa-heart-o" aria-hidden="true"></i> by &nbsp;
                  <a
                    href="https://insightner.com/"
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    Insightner
                  </a>
                </p>

                <p>
                  <a href="/privacy-policy" style={{ textDecoration: "none" }}>
                    Privacy Policy
                  </a>
                  &nbsp; | &nbsp;
                  <a
                    href="/terms-and-condition"
                    style={{ textDecoration: "none" }}
                  >
                    Terms and Conditions
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2;
