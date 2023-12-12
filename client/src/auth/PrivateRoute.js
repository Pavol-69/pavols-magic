import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute({ isAuth }) {
  return isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
