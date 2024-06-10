import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { Link, useParams } from "react-router-dom";
import { set } from "date-fns";
import "./chat.css";

function ViewChatDetails(props) {
  // const { userId, contactUserId } = props.match.params;

  const userId = "65d5993b8f66ed4b869a574f";
  const contactUserId = "65c4662b8f66ed4b869a4d61";

  console.log("userId", userId);
  console.log("ContactuserId", contactUserId);

  const senderReceiverId = userId + "_" + contactUserId;

  console.log("senderReceiverId", senderReceiverId);

  const token = useSelector((state) => state.auth.token);

  const [loading, setLoading] = useState(false);

  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    axios
      .post(
        "/user/user-chat-details",
        { senderReceiverId },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        if (res.data.status === true) {
          setChatData(res.data.result.filteredData);
        }
      });
  }, [token, senderReceiverId]);

  const capitalizeWord = (str) => {
    // return str.charAt(0).toUpperCase() + str.slice(1);
    return str;
  };

  let chatList = "";

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
    chatList = Object.values(chatData).map((conversation) => (
      <div key={Object.keys(conversation)[0]}>
        {Object.values(conversation).map((message) => (
          <>
            {" "}
            <div
              key={message.time}
              className={
                message.replier_id === userId ? "replier1" : "replier2"
              }
            >
              <p>Date: {message.date}</p>
              <p>Message: {message.message}</p>
              {/* <p>Replier ID: {message.replier_id}</p> */}
              <p>
                Reply By:{" "}
                {message.replier_id === userId ? "Sender" : "Receiver"}
              </p>
            </div>
            <hr />
          </>
        ))}
      </div>
    ));
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">User Chat Details</h1>

        <div className="d-none d-sm-inline-block shadow-sm">
          <Link
            to={`/admin/view-chat-point-details/${contactUserId}`}
            className="btn btn-sm btn-primary shadow-sm"
            style={{
              backgroundColor: "#F5007E",
              borderColor: "#F5007E",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go back All
            Chats
          </Link>
        </div>
      </div>

      <div className="row p-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Chat Details</h6>
          </div>
          <div className="card-body">{chatList}</div>
        </div>
      </div>
    </>
  );
}

export default ViewChatDetails;
