
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;