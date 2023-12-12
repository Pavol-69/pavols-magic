import { Outlet, Navigate } from "react-router-dom";

function PublicRoute({ isAuth }) {
  return !isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default PublicRoute;
