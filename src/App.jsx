import { BrowserRouter, Route, Routes , Navigate } from "react-router-dom";
import Login from "./pages/Login";


export default  function App()
{
 return  <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/dashboard" element = {<h2>Dashboard (later)</h2>}/>
                    <Route path="*" element={<Navigate to="login" />} />
                </Routes>
         </BrowserRouter>
    
}