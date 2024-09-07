import { Navigate, Outlet, replace } from 'react-router-dom';
import useAuth from '../hooks/useAuth.hook';
import AuthSpinner from '../components/general/AuthSpinner';
import { PATH_PUBLIC } from '../routes/paths';

//interface for props.
// We receive a roles array anddecide the next step based on array
interface IProps {
  roles: string[];
}

const AuthGuard = ({ roles }: IProps) => {
  const { isAuthenticated, user, isAuthLoading } = useAuth();
 //access to the requested page?
 console.log(roles);
  const hasAccess = isAuthenticated && user?.roles?.find((q) => roles.includes(q));
  if (isAuthLoading) {
    return <AuthSpinner />;
  }
  if (!hasAccess) {
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    return null;  // Return null since the component should not render anything after redirection
  }

  return <Outlet />;
};
export default AuthGuard;