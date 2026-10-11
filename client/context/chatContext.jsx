import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

/* eslint-disable react-refresh/only-export-components */
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setunseenMessages] = useState({});
    const [incomingRequestsCount, setIncomingRequestsCount] = useState(0);

    const { socket, axios, authUser } = useContext(AuthContext);

    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setunseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchRequestsCount = async () => {
        if (!authUser) return;
        try {
            const { data } = await axios.get("/api/friends/requests");
            if (data.success) {
                setIncomingRequestsCount(data.received?.length || 0);
            }
        } catch (error) {
            console.error("Failed to fetch requests count", error);
        }
    };

    const getMessages = async (userId, page = 1) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}?page=${page}&limit=20`);
            if (data.success) {
                if (page === 1) {
                    setMessages(data.messages);
                } else {
                    setMessages(prev => {
                        const existingIds = new Set(prev.map(m => m._id));
                        const newMessages = data.messages.filter(m => !existingIds.has(m._id));
                        return [...newMessages, ...prev]; // Prepend older messages
                    });
                }
                return data.pagination;
            }
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const subscribetoMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.get(`/api/messages/mark/${newMessage._id}`);
            } else {
                setunseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: (prevUnseenMessages[newMessage.senderId] || 0) + 1
                }));
            }
        });

        socket.on("friendRequestReceived", (request) => {
            toast.success(`${request.sender?.fullName || "Someone"} sent you a friend request!`, {
                icon: "👋",
                duration: 4000
            });
            setIncomingRequestsCount(prev => prev + 1);
        });

        socket.on("friendRequestAccepted", (data) => {
            toast.success(`${data.acceptedBy?.fullName || "Your friend"} accepted your friend request!`, {
                icon: "🎉",
                duration: 4000
            });
            getUsers();
        });
    };

    const unsubscribeFromMessages = () => {
        if (!socket) return;
        socket.off("newMessage");
        socket.off("friendRequestReceived");
        socket.off("friendRequestAccepted");
    };

    useEffect(() => {
        subscribetoMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser]);

    useEffect(() => {
        if (authUser) {
            fetchRequestsCount();
        }
    }, [authUser]);

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages: setunseenMessages,
        incomingRequestsCount,
        setIncomingRequestsCount,
        fetchRequestsCount
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};