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
import Withdraw from "./pages/Withdraw/Withdraw";
import Transfer from "./pages/Transfer/Transfer";
import TransferLog from "./pages/TransferLog/TransferLog";
import TransactionLog from "./pages/TransactionLog/TransactionLog";
import Currencies from "./pages/Currencies/Currencies";
import FindCurrency from "./pages/FindCurrency/FindCurrency";
import UpdateRate from "./pages/UpdateRate/UpdateRate";
import CurrencyCalculator from "./pages/CurrencyCalculator/CurrencyCalculator";
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
              <Route path="withdraw" element={<Withdraw />} />
              <Route path="transfer" element={<Transfer />} />
              <Route path="transfer-log" element={<TransferLog />} />
              <Route path="log" element={<TransactionLog />} />
            </Route>

        {/* Currencies: available to any logged-in user */}
        <Route path="currency" element={<Currencies />} />
        <Route path="currency/find" element={<FindCurrency />} />
        <Route path="currency/calculator" element={<CurrencyCalculator />} />
        <Route
              path="currency/update"
              element={
                <ProtectedRoute permission={Permissions.TRANSACTIONS}>
                  <UpdateRate />
                </ProtectedRoute>
              }
            />

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