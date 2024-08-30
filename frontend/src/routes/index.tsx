import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PATH_DASHBOARD, PATH_PUBLIC } from "./paths";
import AuthGuard from "../auth/AuthGuard";
import {
  allAccessRoles,
  adminAccessRoles,
} from "../auth/auth.utils";
import Layout from "../components/layout";

//

// Lazy load components
const AdminPage = lazy(() => import("../pages/dashboard/AdminPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const MyLogsPage = lazy(() => import("../pages/dashboard/MyLogsPage"));
const SystemLogsPage = lazy(() => import("../pages/dashboard/SystemLogsPage"));
const UpdateRolePage = lazy(() => import("../pages/dashboard/UpdateRolePage"));
const UserPage = lazy(() => import("../pages/dashboard/UserPage"));
const UsersManagementPage = lazy(
  () => import("../pages/dashboard/UsersManagementPage")
);
const HomePage = lazy(() => import("../pages/public/HomePage"));
const LoginPage = lazy(() => import("../pages/public/LoginPage"));
const NotFoundPage = lazy(() => import("../pages/public/NotFoundPage"));
const RegisterPage = lazy(() => import("../pages/public/RegisterPage"));
const UnauthorizedPage = lazy(() => import("../pages/public/UnauthorizedPage"));

const GlobalRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path={PATH_PUBLIC.register}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path={PATH_PUBLIC.login}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path={PATH_PUBLIC.unauthorized}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <UnauthorizedPage />
            </Suspense>
          }
        />

        <Route element={<AuthGuard roles={allAccessRoles} />}>

          <Route
            path={PATH_DASHBOARD.dashboard}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.myLogs}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <MyLogsPage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.user}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <UserPage />
              </Suspense>
            }
          />
        </Route>

        

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          
          <Route
            path={PATH_DASHBOARD.usersManagement}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <UsersManagementPage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.updateRole}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <UpdateRolePage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.systemLogs}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SystemLogsPage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.admin}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminPage />
              </Suspense>
            }
          />
        </Route>
        <Route
          path={PATH_PUBLIC.notFound}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFoundPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={<Navigate to={PATH_PUBLIC.notFound} replace />}
        />
      </Route>
    </Routes>
  );
};

export default GlobalRouter;
