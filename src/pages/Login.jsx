import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUserCircle } from "react-icons/fa";

import api from "../api";

export default function Login()
{
    const navigate =  useNavigate();

    const [username , setUsername] = useState("");
    const [password , setPassword] = useState("");
    const [error , setError] =  useState("");
    const [loading , setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setLoading(true);

        try {

            const {data} = await api.post("/api/auth/login" , {username , password});

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

    return  <div  style={styles.page}>

                <form   style={styles.card}  onSubmit={handleSubmit}>

                   <div>
                       <FaUserCircle  size={70} color="#1d4ed8"  />
                       <h2 style={styles.header}>Bank Login</h2>
                    </div> 
 

                <div style={styles.inputGroup}>

                     <FaUser style={styles.icon} />
                     <input 
                         type="text"
                         placeholder="Username" 
                         value={username}
                         onChange={(e)=>setUsername(e.target.value)}
                         required
                         style={styles.input}
                    />
                </div>
                   

                 <div style={styles.inputGroup}>
                    <FaLock style={styles.icon} />
                    <input 
                           type="password"
                           placeholder="Password"
                           value={password}
                           onChange={(e) => {setPassword(e.target.value)}}
                           required
                           style={styles.input}
                    />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button   style={styles.button} type="submit"  disabled={loading}>{loading ? "Logging in..." : "Login"}</button>

                </form>
           </div>
}


const styles = {

    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f2f4f7",
        fontFamily: "sans-serif",
    },

    card : {
        width:320,
        padding:24,
        background: "#fff",
        borderRadius:8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    },

    input : {
        width:"100%",
        padding:10,
        marginBottom:12,
        border: "1px solid #ccc",
        borderRadius: 4,
        boxSizing: "border-box",
    },
    button: {
           width: "100%",
            padding: 10,
            border: "none",
            borderRadius: 4,
            background: "#1d4ed8",
            color: "#fff",
            cursor: "pointer",
    },

    error: {
            color: "#dc2626",
            fontSize: 14,
            marginTop: 0,

    },

    header: {
        textAlign: "center",
        marginBottom: 20,
    },

    inputGroup: {
        position: "relative",      
        marginBottom: 12,
    },

    icon: {
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",   
            color: "#888",
    },
}