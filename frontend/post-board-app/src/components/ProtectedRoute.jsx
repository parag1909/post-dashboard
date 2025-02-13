import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
 
const ProtectedRoute = ({ element }) => {
  const { token } = useContext(AppContext);
 
  return token ? element : <Navigate to="/" replace />;
};
 
export default ProtectedRoute;