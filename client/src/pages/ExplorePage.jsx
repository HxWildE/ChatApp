import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/chatContext';
import assets from '../assets/assets';
import toast from 'react-hot-toast';

const ExplorePage = () => {
  const navigate = useNavigate();
  const { axios, authUser, onlineUsers } = useContext(AuthContext);
  const { 
    setSelectedUser, 
    getUsers, 
    incomingRequestsCount, 
    fetchRequestsCount 
  } = useContext(ChatContext);

  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'received' | 'sent'
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch search or all discoverable users
  const fetchUsers = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/friends/search${query ? `?query=${encodeURIComponent(query)}` : ''}`);
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch friend requests
  const fetchRequests = async () => {
    try {
      const { data } = await axios.get('/api/friends/requests');
      if (data.success) {
        setReceivedRequests(data.received || []);
        setSentRequests(data.sent || []);
        fetchRequestsCount();
      }
    } catch (error) {
      console.error('Failed to fetch requests', error);
    }
  };

  useEffect(() => {
    fetchUsers(searchQuery);
    fetchRequests();
  }, []);

  // Handle Search Input with Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Send friend request
  const handleSendRequest = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const { data } = await axios.post(`/api/friends/request/${userId}`);
      if (data.success) {
        toast.success('Friend request sent!');
        // Update user relationship state locally
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, relationship: 'sent', requestId: data.data?._id } : u));
        fetchRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Accept friend request
  const handleAcceptRequest = async (requestId, targetUserId) => {
    const key = requestId || targetUserId;
    setActionLoading(prev => ({ ...prev, [key]: true }));
    try {
      const { data } = await axios.post(`/api/friends/accept/${requestId}`);
      if (data.success) {
        toast.success('Friend request accepted! You can now chat.');
        // Refresh sidebar and local lists
        getUsers();
        fetchRequests();
        setUsers(prev => prev.map(u => 
          (u.requestId === requestId || u._id === targetUserId) 
            ? { ...u, relationship: 'friend', requestId: null } 
            : u
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Reject / Cancel friend request
  const handleRejectOrCancel = async (requestId, targetUserId) => {
    const key = requestId || targetUserId;
    setActionLoading(prev => ({ ...prev, [key]: true }));
    try {
      const { data } = await axios.post(`/api/friends/reject/${requestId}`);
      if (data.success) {
        toast.success('Request removed');
        fetchRequests();
        setUsers(prev => prev.map(u => 
          (u.requestId === requestId || u._id === targetUserId) 
            ? { ...u, relationship: 'none', requestId: null } 
            : u
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove request');
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Jump to chat with friend
  const handleStartChat = (user) => {
    setSelectedUser(user);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-6 px-4">
      {/* Container Box */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[85vh]">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition text-slate-300 hover:text-white flex items-center gap-2 text-sm"
              title="Back to Chats"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Explore & Friends</span>
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-400 border border-blue-700/40">
                  Global Directory
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Search new people, expand your network, and manage invitations</p>
            </div>
          </div>

          {/* Quick Profile Pill */}
          <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/40 py-1.5 px-3 rounded-full">
            <img 
              src={authUser?.profilePic || assets.avatar_icon} 
              alt="You" 
              className="w-7 h-7 rounded-full object-cover border border-slate-700"
            />
            <span className="text-xs font-medium text-slate-300 max-w-[120px] truncate">{authUser?.fullName}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-6 gap-2 pt-3">
          <button
            onClick={() => setActiveTab('discover')}
            className={`pb-3 px-4 text-xs font-semibold tracking-wide uppercase transition relative ${
              activeTab === 'discover' 
                ? 'text-white border-b-2 border-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Discover People ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('received')}
            className={`pb-3 px-4 text-xs font-semibold tracking-wide uppercase transition relative flex items-center gap-2 ${
              activeTab === 'received' 
                ? 'text-white border-b-2 border-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Requests Received</span>
            {receivedRequests.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                {receivedRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`pb-3 px-4 text-xs font-semibold tracking-wide uppercase transition relative ${
              activeTab === 'sent' 
                ? 'text-white border-b-2 border-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Requests Sent ({sentRequests.length})
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">

          {/* TAB 1: DISCOVER PEOPLE */}
          {activeTab === 'discover' && (
            <div className="flex flex-col gap-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name..."
                  className="w-full pl-10 pr-10 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Users Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                  <div className="w-8 h-8 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div>
                  <p className="text-xs">Finding people...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-xl mb-3">
                    🔍
                  </div>
                  <p className="text-sm font-medium text-slate-300">No users found</p>
                  <p className="text-xs text-slate-500 mt-1">Try searching with a different name</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((user) => {
                    // Privacy-First: Only show online status if users are already mutual friends
                    const isOnline = user.relationship === 'friend' && onlineUsers.includes(String(user._id));
                    const isProcessing = actionLoading[user._id] || (user.requestId && actionLoading[user.requestId]);

                    return (
                      <div 
                        key={user._id}
                        className="bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between gap-4 group"
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Avatar with presence */}
                          <div className="relative shrink-0">
                            <img
                              src={user.profilePic || assets.avatar_icon}
                              alt={user.fullName}
                              className="w-12 h-12 rounded-full object-cover border border-slate-700/60"
                            />
                            {isOnline && (
                              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online"></span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-white truncate">{user.fullName}</h3>
                              {user.relationship === 'friend' && (
                                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full font-medium shrink-0">
                                  Friend
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                              {user.bio ? `"${user.bio}"` : 'No bio added'}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                          {/* Case 1: Already Friends */}
                          {user.relationship === 'friend' && (
                            <button
                              onClick={() => handleStartChat(user)}
                              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Open Chat
                            </button>
                          )}

                          {/* Case 2: I already sent them a request */}
                          {user.relationship === 'sent' && (
                            <div className="w-full flex items-center gap-2">
                              <span className="flex-1 py-1.5 px-3 bg-slate-800 text-slate-400 border border-slate-700/60 rounded-lg text-xs font-medium text-center">
                                Request Sent
                              </span>
                              {user.requestId && (
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleRejectOrCancel(user.requestId, user._id)}
                                  className="py-1.5 px-3 bg-slate-800/80 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700/50 hover:border-red-800/40 rounded-lg text-xs font-medium transition"
                                >
                                  {isProcessing ? '...' : 'Cancel'}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Case 3: THEY sent ME a request -> Give Accept and Decline! */}
                          {user.relationship === 'received' && (
                            <div className="w-full flex items-center gap-2">
                              <button
                                disabled={isProcessing}
                                onClick={() => handleAcceptRequest(user.requestId, user._id)}
                                className="flex-1 py-2 px-3 bg-white hover:bg-slate-200 text-black rounded-lg text-xs font-bold transition shadow-md"
                              >
                                {isProcessing ? 'Accepting...' : 'Accept Request'}
                              </button>
                              <button
                                disabled={isProcessing}
                                onClick={() => handleRejectOrCancel(user.requestId, user._id)}
                                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                              >
                                Decline
                              </button>
                            </div>
                          )}

                          {/* Case 4: No relationship yet -> High contrast Black & White Send Request */}
                          {user.relationship === 'none' && (
                            <button
                              disabled={isProcessing}
                              onClick={() => handleSendRequest(user._id)}
                              className="w-full py-2 px-4 bg-white hover:bg-slate-200 text-black rounded-lg text-xs font-bold transition duration-150 flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                              {isProcessing ? (
                                <span>Sending...</span>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                  </svg>
                                  <span>Send Request</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REQUESTS RECEIVED */}
          {activeTab === 'received' && (
            <div className="flex flex-col gap-4">
              {receivedRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-xl mb-3">
                    📬
                  </div>
                  <p className="text-sm font-medium text-slate-300">No pending friend requests</p>
                  <p className="text-xs text-slate-500 mt-1">When someone sends you a connection invite, it will appear here</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {receivedRequests.map((req) => {
                    const sender = req.sender || {};
                    const isProcessing = actionLoading[req._id];

                    return (
                      <div 
                        key={req._id}
                        className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={sender.profilePic || assets.avatar_icon}
                            alt={sender.fullName}
                            className="w-12 h-12 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <h3 className="text-sm font-semibold text-white">{sender.fullName}</h3>
                            {sender.bio && (
                              <p className="text-xs text-slate-400 mt-0.5 italic">"{sender.bio}"</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            disabled={isProcessing}
                            onClick={() => handleAcceptRequest(req._id, sender._id)}
                            className="py-2 px-4 bg-white hover:bg-slate-200 text-black rounded-lg text-xs font-bold transition shadow-md disabled:opacity-50"
                          >
                            {isProcessing ? 'Accepting...' : 'Accept'}
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => handleRejectOrCancel(req._id, sender._id)}
                            className="py-2 px-3 bg-slate-800 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-700 rounded-lg text-xs font-medium transition"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REQUESTS SENT */}
          {activeTab === 'sent' && (
            <div className="flex flex-col gap-4">
              {sentRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-xl mb-3">
                    📤
                  </div>
                  <p className="text-sm font-medium text-slate-300">No pending sent requests</p>
                  <p className="text-xs text-slate-500 mt-1">Discover new people to connect and chat</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {sentRequests.map((req) => {
                    const receiver = req.receiver || {};
                    const isProcessing = actionLoading[req._id];

                    return (
                      <div 
                        key={req._id}
                        className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={receiver.profilePic || assets.avatar_icon}
                            alt={receiver.fullName}
                            className="w-12 h-12 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <h3 className="text-sm font-semibold text-white">{receiver.fullName}</h3>
                            <span className="inline-block mt-1 text-[10px] bg-slate-800 text-slate-400 border border-slate-700/60 px-2 py-0.5 rounded-full font-medium">
                              Waiting for approval...
                            </span>
                          </div>
                        </div>

                        <div>
                          <button
                            disabled={isProcessing}
                            onClick={() => handleRejectOrCancel(req._id, receiver._id)}
                            className="py-1.5 px-3 bg-slate-800/80 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700/60 hover:border-red-800/40 rounded-lg text-xs font-medium transition"
                          >
                            {isProcessing ? 'Cancelling...' : 'Cancel Request'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
