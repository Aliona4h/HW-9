import React, { useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_SERVER_URL = `${process.env.REACT_APP_BASE_URL}notifications`;

interface Notification {
  data: string;
  user: string;
}

interface NotificationComponentProps {
  onNewPost: () => void;
  currentPage: number;
}

const SocketNotification: React.FC<NotificationComponentProps> = ({
  onNewPost,
  currentPage,
}) => {
  const connectSocket = useCallback(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    socket.on("newPost", (data: Notification) => {
      toast.success(
        <div>
          <strong>{data.user}:</strong> added a new post!
        </div>,
        {
          position: "top-right",
          duration: 5000,
        }
      );

      if (currentPage === 1) {
        window.location.reload();
      }

      onNewPost();
    });

    return socket;
  }, [onNewPost, currentPage]);

  useEffect(() => {
    const socket = connectSocket();

    return () => {
      socket.disconnect();
    };
  }, [connectSocket]);

  return <Toaster />;
};

export default SocketNotification;
