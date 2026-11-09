import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import api from "../../service/api";
import bankImg from "../../assets/bank.png";
import "./Login.css";

export default function Login()
{
    const navigate =  useNavigate();

    const [username , setUsername] = useState("");
    const [password , setPassword] = useState("");
    const [error , setError] =  useState("");
    const [loading , setLoading] = useState(false);
    const [showPassword , setShowPassword] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setLoading(true);

        try {

            const {data} = await api.post("/auth/login" , {username , password});

            localStorage.setItem("token" , data.token);
            localStorage.setItem("user" , JSON.stringify(data.user));

            navigate("/dashboard");

        } catch (error)
        {
            if(!error.response) setError("Cannot connect to server");
            else setError(error.response.data?.message || "Login Failed");

        }finally
        {
            setLoading(false);
        }


    }

    return  <div className="login-page">

                <div className="login-brand">
                    <div className="login-logo-box">
                        <img src={bankImg} alt="Bank" />
                    </div>
                    <h1>Welcome Back</h1>
                    <div className="bar" />
                </div>

                <div className="login-form-wrap">
                    <form className="login-form" onSubmit={handleSubmit}>

                        <h2>Sign in</h2>

                        <div className="field">
                            <FaUser className="lead-icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e)=>setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="field">
                            <FaLock className="lead-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-eye"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <button className="login-btn" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>
                </div>
           </div>
}
