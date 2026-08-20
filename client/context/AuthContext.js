import { Children, createContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import { data } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseUrl = backendUrl;
export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

	const [token , setToken] = useState(localStorage.getItem("token"));
	const [authUser , setAuthUser ] = useState(null);
	const [onlineUsers , setOnlineUsers] = useState([]);
	const [socket , setSocket] = useState(null);

	const value = {
				axios, 
				authUser,
				onlineUsers,
				socket
		}

	const checkAuth = async () =>{
		 try{
				await axios.get("/api/auth/check"); 
				if(data.success){
					setAuthUser(data.user);
					connectSocket(data.user);
				}
			} catch(error) {
				toast.error(error.message);
			}
		}

		useEffect (()=>{
			if(token){
				axios.defaults.headers.common["token"] = token;
			}
		},[])


		const connectSocket = () =>{
				if(!userData || socket?.connected) return;
                
				const newSocket = io(backendUrl ,{
						query: {
							userId : userData._id,
						}
				});

				newSocket.connect();
				setSocket(newSocket);
		}

		newSocket.on("getOnlineUsers" , (userIds) =>{
			setOnlineUsers(userIds);
		})

		return (
		<AuthContext.Provider value={value}>
			{ children }
		</AuthContext.Provider>
		)
}