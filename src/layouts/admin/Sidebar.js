import axios from "axios";
import React from "react";
import {
  BrowserRouter as Router,
  useHistory,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import swal from "sweetalert";
import routes from "../../routes/routes";
import MasterLayout from "./MasterLayout";
import Home from "../../components/Home";
import AllEvent from "./AllEvent";
import Swal from "sweetalert2";

import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../authActions";


function Sidebar({ menuOpen, setMenuOpen, toggleMenu }) {
  const history = useHistory();

  const dispatch = useDispatch();


  const logoutSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title:
        '<span style="font-size: 24px;">Are you sure want to Logout?</span>',
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/logout`).then(function (res) {
          if (res.data.status === 200) {
            dispatch(logoutSuccess());

            Swal.fire({
              icon: "success",
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500,
            });

            history.push("/login");

            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        });
      }
    });
  };

  return (
    <>
      <ul
        // className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${
          menuOpen ? "toggled" : ""
        }`}
        id="accordionSidebar"
      >
        {/* <!-- Sidebar - Brand --> */}
        <Link
          to="/admin/dashboard"
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="index.html"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            {/* <i className="fas fa-laugh-wink"></i> */}
          </div>
          <div className="sidebar-brand-text mx-3">Klout Marketing</div>
        </Link>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider my-0" />

        {/* <!-- Nav Item - Dashboard --> */}
        <li className="nav-item active">
          <Link to="/admin/dashboard" className="nav-link">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">Team Member</div>

        {/* <!-- Nav Item - Pages Collapse Member--> */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseTwo1"
            aria-expanded="true"
            aria-controls="collapseTwo1"
          >
            <i className="fa fa-solid fa-calendar"></i>
            <span>Members</span>
          </a>
          <div
            id="collapseTwo1"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link to="/admin/all-member" className="collapse-item">
                All Member
              </Link>
              <Link to="/admin/add-member" className="collapse-item">
                Add New Member
              </Link>
            </div>
          </div>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">ICP</div>

        {/* <!-- Nav Item - Pages Collapse ICP --> */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseThree"
            aria-expanded="true"
            aria-controls="collapseThree"
          >
            <i className="fa fa-solid fa-calendar"></i>
            <span>ICP</span>
          </a>
          <div
            id="collapseThree"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link to="/admin/all-icp" className="collapse-item">
                Major Campaign ROI
              </Link>
              <Link to="/admin/upload-account-list" className="collapse-item">
                Upload Account List
              </Link>
            </div>
          </div>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider" />

        {/* <!-- Heading --> */}
        <div className="sidebar-heading">Addons</div>

        {/* <!-- Nav Item - Charts --> */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/get-help">
            <i className="fas fa-hands-helping"></i>
            <span>Get Help</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Tables --> */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/faqs">
            <i className="fa fa-solid fa-question"></i>
            <span>FAQ's</span>
          </Link>
        </li>

        {/* <!-- Nav Item - Logout --> */}
        <li className="nav-item">
          <button className="nav-link" onClick={logoutSubmit}>
            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
            <span>Logout</span>
          </button>
        </li>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider d-none d-md-block" />

        {/* <!-- Sidebar Toggler (Sidebar) --> */}
        <div className="text-center d-none d-md-inline">
          <button
            className="rounded-circle border-0"
            id="sidebarToggle"
          ></button>
        </div>
      </ul>
    </>
  );
}

export default Sidebar;
