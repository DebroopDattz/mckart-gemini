import React, { useEffect, useRef, useState } from 'react';
import config from '../config';
import { X, Send, Mic, MicOff } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const ChatModal = ({ isOpen, onClose, activeItem, currentUser, isBuyer }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isListening, setIsListening] = useState(false);
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setNewMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // Fetch initial messages
    useEffect(() => {
        if (isOpen && activeItem) {
            const fetchMessages = async () => {
                try {
                    const itemId = isBuyer ? activeItem.id : activeItem.itemId;
                    const res = await fetch(`${config.API_BASE_URL}/api/chat/${itemId}`);
                    const data = await res.json();
                    setMessages(data);
                    scrollToBottom();
                } catch (err) {
                    console.error("Failed to fetch messages", err);
                    setMessages([]);
                }
            };
            fetchMessages();
        }
    }, [isOpen, activeItem, isBuyer]);

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeItem) return;

        try {
            const payload = isBuyer ? {
                itemId: activeItem.id,
                itemName: activeItem.name,
                buyerName: currentUser.name || "Buyer",
                message: newMessage,
                sender: "buyer",
            } : {
                itemId: activeItem.itemId,
                itemName: activeItem.itemName,
                buyerName: activeItem.buyerName,
                message: newMessage,
                sender: "seller",
            };

            const res = await fetch(`${config.API_BASE_URL}/api/chat/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to send message");

            // Optimistic update
            setMessages(prev => [...prev, { message: newMessage, sender: isBuyer ? 'buyer' : 'seller' }]);
            setNewMessage("");
            scrollToBottom();
        } catch (err) {
            console.error(err);
            alert("Failed to send message");
        }
    };

    if (!isOpen || !activeItem) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-md h-[600px] flex flex-col p-0 overflow-hidden bg-[#1a1f2e] border-white/20">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div>
                        <h3 className="font-bold text-lg">
                            {isBuyer ? activeItem.name : `${activeItem.itemName} - ${activeItem.buyerName}`}
                        </h3>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Live Chat
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
                    {messages.map((msg, i) => {
                        const isMe = msg.sender === (isBuyer ? 'buyer' : 'seller');
                        return (
                            <div
                                key={i}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${isMe
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white/10 text-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                    <div className="flex gap-2">
                        <button
                            onClick={toggleListening}
                            className={`p-3 rounded-xl transition-all ${isListening
                                ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/50'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                }`}
                            title="Dictate message"
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <input
                            type="text"
                            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500/50 transition-colors"
                            placeholder={isListening ? "Listening..." : "Type your message..."}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button
                            variant="primary"
                            onClick={sendMessage}
                            className="px-3 rounded-xl"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ChatModal;
