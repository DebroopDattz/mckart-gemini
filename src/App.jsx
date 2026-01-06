import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SellerDashBoard from "./components/SellerDashBoard";
import BuyerDashboard from "./components/BuyerDashboard";
import AuthPage from "./components/AuthPage";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";
import AIChatWidget from "./components/AIChatWidget";

export default function App() {
  const navigate = useNavigate();

  // Load user from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("mckart_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Global Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const handleLogin = (userData) => {
    localStorage.setItem("mckart_token", userData.token);
    localStorage.setItem("mckart_user", JSON.stringify(userData.user));
    setUser(userData.user);
    navigate(userData.user.role === "buyer" ? "/buyer" : "/seller");
  };

  const handleRoleSwitch = (newRole) => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    localStorage.setItem("mckart_user", JSON.stringify(updatedUser)); // Optimistic update
    navigate(newRole === "buyer" ? "/buyer" : "/seller");
  };

  const handleLogout = () => {
    localStorage.removeItem("mckart_token");
    localStorage.removeItem("mckart_user");
    setUser(null);
    setIsChatOpen(false);
    setActiveChat(null);
    navigate("/");
  };

  const openChat = (chatItem) => {
    setActiveChat(chatItem);
    setIsChatOpen(true);
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500/30">
      {user && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          onSwitchRole={handleRoleSwitch}
        />
      )}

      {user && (
        <ChatWidget
          user={user}
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      )}

      {user && <AIChatWidget />}

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={user.role === "buyer" ? "/buyer" : "/seller"} replace />
            ) : (
              <AuthPage onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/buyer"
          element={
            <ProtectedRoute>
              <BuyerDashboard user={user} openChat={openChat} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller"
          element={
            <ProtectedRoute>
              <SellerDashBoard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}
