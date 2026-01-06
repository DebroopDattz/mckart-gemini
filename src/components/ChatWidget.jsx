import React, { useState, useEffect } from 'react';
import config from '../config';
import { MessageSquare, X } from 'lucide-react';
import Card from './ui/Card';
import ChatModal from './ChatModal';

const ChatWidget = ({ user, isOpen, setIsOpen, activeChat, setActiveChat }) => {
    const [allChats, setAllChats] = useState([]);

    // Fetch chats when widget is opened
    useEffect(() => {
        if (isOpen) {
            const fetchChats = async () => {
                const url = user.role === 'seller'
                    ? `${config.API_BASE_URL}/api/chat/seller-chats`
                    : `${config.API_BASE_URL}/api/chat/buyer-chats/${user.name}`;

                try {
                    const res = await fetch(url);
                    const data = await res.json();
                    setAllChats(data);
                } catch (err) {
                    console.error("Failed to fetch chats", err);
                }
            };
            fetchChats();
        }
    }, [isOpen, user]);

    const handleChatClick = (chat) => {
        setActiveChat(chat);
        // We keep isOpen true, but the Detail view will overlay or replace the List view
    };

    const closeDetail = () => {
        setActiveChat(null);
    };

    const closeWidget = () => {
        setIsOpen(false);
        setActiveChat(null);
    };

    // If activeChat is present, show ChatModal (Detail View)
    if (activeChat) {
        return (
            <ChatModal
                isOpen={true}
                onClose={closeDetail}
                activeItem={activeChat}
                currentUser={user}
                isBuyer={user.role === 'buyer'}
            />
        );
    }

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:scale-110 transition-transform z-[90]"
            >
                <MessageSquare size={28} />
            </button>

            {/* Chat List Modal (Overlay) */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="w-full max-w-md h-[600px] flex flex-col bg-[#1a1f2e] border-white/20 p-0">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold">Your Conversations</h3>
                            <button onClick={closeWidget} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {allChats.length === 0 && (
                                <div className="text-center text-gray-500 mt-20">
                                    <p>No active conversations.</p>
                                    {user.role === 'buyer' && <p className="text-sm mt-2">Start chatting from any item card!</p>}
                                </div>
                            )}
                            {allChats.map((chat, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleChatClick(chat)}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                                >
                                    <h4 className="font-semibold text-blue-300">{chat.itemName}</h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {user.role === 'seller' ? `Buyer: ${chat.buyerName}` : 'Seller: (Check Detail)'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
