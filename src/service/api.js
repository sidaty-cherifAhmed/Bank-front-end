import axios from "axios";

const  api = axios.create(
    {
        baseURL:"http://localhost:8080/api"
    }
)


api.interceptors.request.use(
    (config)  =>
                {
                    const token = localStorage.getItem("token");

                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }

                    return config;
                }
)


// معالج الردود: عند 401 (رمز منتهٍ أو غير صالح) نمسح الجلسة ونرجع لصفحة الدخول
api.interceptors.response.use(

    (response) => response,

    (error)    =>{

        const isLogin = error.config?.url?.includes("/auth/login");

        if (error.response?.status === 401 && !isLogin) 
        {
            localStorage.clear();
            window.location.href = '/login';  
        }

        return Promise.reject(error);

    }
)
export default api;