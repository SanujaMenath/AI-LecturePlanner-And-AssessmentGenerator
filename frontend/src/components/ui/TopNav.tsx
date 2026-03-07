import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  HelpCircle,
  ChevronDown,
  User as UserIcon,
  BellRing,
} from "lucide-react";

// 1. Define the TypeScript Interface for our Notification object
interface NotificationItem {
  id: string;
  recipient_id?: string;
  target_role?: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

const TopNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 2. Explicitly type our State as an array of NotificationItems
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // 3. Explicitly type the Ref as an HTML Div Element
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate unread count dynamically
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // WebSocket Connection & Fetching Initial Data
  // WebSocket Connection & Fetching Initial Data
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true; // 1. Track if the component is alive

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        // Make sure there is no trailing slash on this URL
        const response = await fetch(`http://localhost:8000/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok && isMounted) {
          const data: NotificationItem[] = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();

    // Establish WebSocket Connection
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${user.id}`);
    // 2. Safety check: If React killed the component while connecting
    ws.onopen = () => {
      if (!isMounted) {
        ws.close();
      }
    };

    ws.onmessage = (event: MessageEvent) => {
      if (!isMounted) return;
      const newNotification: NotificationItem = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    // 3. The Strict Mode Fix
    return () => {
      isMounted = false;
      // Only close the websocket if it actually finished opening
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user?.id]);

  // Click Outside to Close Dropdown
  useEffect(() => {
    // 5. Type the event as a standard MouseEvent
    const handleClickOutside = (event: MouseEvent) => {
      // Assert event.target as Node to satisfy TypeScript's DOM logic
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark as Read Function
  // 6. Explicitly type the function parameters
  const markAsRead = async (notificationId: string, link?: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n,
      ),
    );

    try {
      const token = localStorage.getItem("token");
      await fetch(
        `http://localhost:8000/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Failed to mark read", error);
    }

    if (link) navigate(link);
    setShowDropdown(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md h-20 shadow-sm border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md relative group"></div>

      {/* Right: Actions and Profile */}
      <div className="flex items-center gap-6">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {/* The Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-lg">
                    {unreadCount} New
                  </span>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center text-gray-400">
                      <BellRing size={24} className="mb-2 opacity-50" />
                      <p className="text-sm">You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id, notif.link)}
                        className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.is_read ? "bg-blue-50/30" : ""}`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p
                              className={`text-sm ${!notif.is_read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                            >
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                              {new Date(notif.created_at).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </p>
                          </div>
                          {!notif.is_read && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div
            onClick={() =>
              navigate(
                user?.role === "admin"
                  ? "/admin/profile"
                  : user?.role === "lecturer"
                    ? "/lecturer/profile"
                    : "/student/profile",
              )
            }
            className="flex flex-col items-end"
          >
            <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
              {user?.full_name || "Guest User"}
            </p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">
              {user?.role || "Visitor"}
            </p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner group-hover:bg-primary/20 transition-colors">
              <UserIcon size={20} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <ChevronDown
            size={14}
            className="text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-y-0.5"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
