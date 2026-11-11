import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import AddUser from "./pages/AddUser/AddUser";
import FindUser from "./pages/FindUser/FindUser";
import DeleteUser from "./pages/DeleteUser/DeleteUser";
import UpdateUser from "./pages/UpdateUser/UpdateUser";
import AddClient from "./pages/AddClient/AddClient";
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