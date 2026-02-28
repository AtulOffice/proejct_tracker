import React from "react";
import { Bell, X, Check, AlertCircle, Info, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../apiCall/notefication.Api";
import apiClient from "../api/axiosClient";

const NotificationBell = ({ setOpenNotification, notificationlist }) => {
    const dispatch = useDispatch();
    const handleMarkAsRead = async (notificationId) => {
        try {
            await apiClient.patch(
                `/notifications/read/${notificationId}`
            );
            dispatch(fetchNotifications());
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    const handleMarkAsReadAll = async () => {
        try {
            await apiClient.patch(
                `/notifications/read-all`
            );
            dispatch(fetchNotifications());
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };


    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <Check className="w-4 h-4 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'info':
            default:
                return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {notificationlist.length > 0 && (
                            <p className="text-xs text-gray-500">
                                {notificationlist.length} new {notificationlist.length === 1 ? 'item' : 'items'}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setOpenNotification(false)}
                    className="p-2 hover:bg-white rounded-lg transition-all duration-200 group"
                    aria-label="Close notifications"
                >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notificationlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">All caught up!</p>
                        <p className="text-xs text-gray-400 text-center">
                            You don't have any notifications right now
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notificationlist.map((n, index) => (
                            <div
                                key={n._id}
                                className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group relative overflow-hidden"
                                style={{
                                    animationDelay: `${index * 50}ms`
                                }}
                            >
                                {!n.isRead && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />
                                )}

                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                            {getNotificationIcon(n.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                {!n.isRead && (
                                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.7)] mt-0.5" />
                                                )}
                                                <h4
                                                    className={`text-sm font-semibold truncate transition-colors duration-200 ${n.isRead ? "text-gray-400" : "text-gray-900"
                                                        }`}
                                                >
                                                    {n.title}
                                                </h4>
                                            </div>
                                            {!n.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(n._id)}
                                                    className="flex-shrink-0 text-[11px] font-medium cursor-pointer text-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-2 py-0.5 rounded-full transition-all duration-150 leading-5"
                                                >
                                                    Mark read
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                            {n.message}
                                        </p>
                                        <div className="flex items-center justify-between px-1 py-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-50 ring-1 ring-indigo-100">
                                                    <User size={10} className="text-indigo-400" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 tracking-tight">
                                                    {n.createdBy?.username}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 leading-none">
                                                    {getTimeAgo(n.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {notificationlist.length > 0 && (
                <div onClick={() => false ? handleMarkAsReadAll() : null} className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <button className="w-full text-sm font-medium cursor-pointer text-blue-600 hover:text-blue-700 transition-colors duration-200">
                        Mark all as read
                    </button>
                </div>
            )}

            {/* <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #a855f7);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #9333ea);
                }
                
                @keyframes slide-in-from-top-2 {
                    from {
                        transform: translateY(-8px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .animate-in {
                    animation: slide-in-from-top-2 0.2s ease-out;
                }
            `}</style> */}
        </div>
    );
};

export default NotificationBell;