import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Redirect, useHistory } from "react-router-dom";
import MasterLayout from "./layouts/admin/MasterLayout";


import { useSelector } from "react-redux";

function AdminPrivateRoute({ ...rest }) {
  const history = useHistory();

  const token = useSelector((state) => state.auth.token);
  
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthenticated = async () => {
      try {

        if (!token) {
          history.push("/login");
          return;
        }

        const response = await axios.get(`/user/checkingAuthenticated`, {
          headers: {
            "x-access-token": token,
          },  
        });

        if (response.status === 200) {
          setAuthenticated(true);
        }

      } catch (error) {
        if (error.response && error.response.status === 401) {
          setAuthenticated(false);

          history.push("/login");
        } else {
          console.error("Error:", error.message);
        }
      }
      setLoading(false);
    };

    checkAuthenticated();
  }, [token, history]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Route
        {...rest}
        render={({ props, location }) =>
          authenticated ? <MasterLayout {...props} /> : <Redirect to="/login" />
        }
      />
    </>
  );
}

export default AdminPrivateRoute;
