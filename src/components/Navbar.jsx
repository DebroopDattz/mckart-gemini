import { Link } from "react-router-dom";
import { LogOut, User, RefreshCcw } from "lucide-react";
import Button from "./ui/Button";
import logo from "../assets/logo.png";


export default function Navbar({ user, onLogout, onSwitchRole }) {
    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 mb-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={logo}
                            alt="McKart Logo"
                                className="w-10 h-10 rounded-xl object-contain"
                                    />
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            McKart
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-sm font-medium text-white">{user.name}</span>
                        <span className="text-xs text-blue-300 uppercase tracking-wider">{user.role} Mode</span>
                    </div>

                    <Button
                        variant="secondary"
                        onClick={() => onSwitchRole(user.role === "buyer" ? "seller" : "buyer")}
                        className="!px-3 !py-2 rounded-lg text-sm"
                        title="Switch Mode"
                    >
                        <RefreshCcw size={16} />
                        <span className="hidden sm:inline">Switch to {user.role === "buyer" ? "Seller" : "Buyer"}</span>
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onLogout}
                        className="!px-3 !py-2"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
