import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import AddUser from "./pages/AddUser/AddUser";
import FindUser from "./pages/FindUser/FindUser";
import DeleteUser from "./pages/DeleteUser/DeleteUser";
import UpdateUser from "./pages/UpdateUser/UpdateUser";
import AddClient from "./pages/AddClient/AddClient";
import ClientList from "./pages/ClientList/ClientList";
import FindClient from "./pages/FindClient/FindClient";
import UpdateClient from "./pages/UpdateClient/UpdateClient";
import DeleteClient from "./pages/DeleteClient/DeleteClient";
import LoginRegister from "./pages/LoginRegister/LoginRegister";
import Deposit from "./pages/Deposit/Deposit";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { Permissions } from "./utils/permissions";
import { Outlet } from "react-router-dom";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />

      <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
         <Route index element={<Dashboard />} />

        <Route
              path="users"
              element={
                <ProtectedRoute permission={Permissions.MANAGE_USERS}>
                  <Outlet />
                </ProtectedRoute>
                        }
            >
              <Route index element={<ManageUsers />} />      {/* List Users */}
              <Route path="add" element={<AddUser />} />     {/* Add User */}
              <Route path="find" element={<FindUser />} />   {/* Find User */}
              <Route path="delete" element={<DeleteUser />} /> {/* Delete User */}
              <Route path="update" element={<UpdateUser />} /> {/* Update User */}
         </Route>

        <Route
              path="clients"
              element={
                <ProtectedRoute permission={Permissions.LIST_CLIENTS}>
                  <ClientList />
                </ProtectedRoute>
              }
            />

        <Route
              path="clients/find"
              element={
                <ProtectedRoute permission={Permissions.FIND_CLIENT}>
                  <FindClient />
                </ProtectedRoute>
              }
            />

        <Route
              path="clients/update"
              element={
                <ProtectedRoute permission={Permissions.UPDATE_CLIENTS}>
                  <UpdateClient />
                </ProtectedRoute>
              }
            />

        <Route
              path="clients/delete"
              element={
                <ProtectedRoute permission={Permissions.DELETE_CLIENT}>
                  <DeleteClient />
                </ProtectedRoute>
              }
            />

        <Route
              path="login-register"
              element={
                <ProtectedRoute permission={Permissions.LOGIN_REGISTER_SCREEN}>
                  <LoginRegister />
                </ProtectedRoute>
              }
            />

        <Route
              path="transactions"
              element={
                <ProtectedRoute permission={Permissions.TRANSACTIONS}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="deposit" replace />} />
              <Route path="deposit" element={<Deposit />} />
            </Route>

        <Route
              path="clients/add"
              element={
                <ProtectedRoute permission={Permissions.ADD_NEW_CLIENT}>
                  <AddClient />
                </ProtectedRoute>
              }
            />

        </Route>


     
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}