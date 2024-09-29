import useAuth from '../../hooks/useAuth.hook';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  console.log(pathname);

  const sideBarRenderer = () => {
    if (isAuthenticated && pathname.toLowerCase().startsWith('/dashboard')) {
      return <Sidebar />;
    }
    return null;
  };

  return (
    <div>
      {!isAuthenticated && <Header />}

{/* Using Outlet, we render all routes that are inside of this Layout */}
<div className='flex'>
  {sideBarRenderer()}
  <Outlet />
      </div>
    </div>
  );
};

export default Layout;