import "../../styles/chat.scss";

import React, {
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import socket from "./socket";
import { store } from "../mainHeader";

import {
  userList,
  userChatMessages,
  userLogout
} from "../../network/chatrrApiService/chatrrApiService";
import { useNavigate } from "react-router-dom";

const ChatApp = () => {

  const messagesEndRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);

  const activeChatRef =
    useRef(null);

  // ================= STATES =================

  const [users, setUsers] =
    useState([]);

  const [receiverId, setReceiverId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [typingUser, setTypingUser] =
    useState("");

  const [showSidebar, setShowSidebar] =
    useState(true);

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  const [unreadCounts, setUnreadCounts] =
    useState({});

  const [lastMessages, setLastMessages] =
    useState({});

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [userDetails, setUserDetails] =
    useContext(store);

  const currentUserId =
    userDetails?.id;

  const navigate = useNavigate()

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  // ================= ACTIVE CHAT =================

  useEffect(() => {

    activeChatRef.current =
      receiverId;

  }, [receiverId]);

  // ================= SELECTED USER =================

  const selectedUser =
    users.find(
      (user) =>
        String(user.id) ===
        String(receiverId)
    );

  // ================= FETCH USERS =================

  const fetchUsers =
    async () => {

      try {

        const res =
          await userList();

        if (
          res?.response
        ) {

          setUsers(
            res.response
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  // ================= FETCH CHAT =================

  const fetchUserChatMessages =
    async (userId) => {

      try {

        setLoadingMessages(
          true
        );

        const res =
          await userChatMessages(
            userId
          );

        if (
          res?.response
        ) {

          setMessages(
            res.response
          );

          const lastMsg =
            res.response[
            res.response.length - 1
            ];

          if (lastMsg) {

            setLastMessages(
              (prev) => ({
                ...prev,
                [userId]:
                  lastMsg,
              })
            );
          }
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoadingMessages(
          false
        );
      }
    };

  // ================= INITIAL LOAD =================

  useEffect(() => {

    fetchUsers();

  }, []);

  // ================= SELECT CHAT =================

  useEffect(() => {

    if (!receiverId)
      return;

    fetchUserChatMessages(
      receiverId
    );

    // RESET UNREAD

    setUnreadCounts(
      (prev) => ({
        ...prev,
        [receiverId]: 0,
      })
    );

    // READ EVENT

    socket.emit(
      "message_read",
      {
        sender_id:
          receiverId,
      }
    );

  }, [receiverId]);

  // ================= SOCKET =================

  useEffect(() => {

    socket.auth = {
      token:
        localStorage.getItem(
          "accesstoken"
        ),
    };

    if (!socket.connected) {

      socket.connect();
    }

    // ================= RECEIVE MESSAGE =================

    const receiveMessage =
      (data) => {

        // CURRENT CHAT

        if (

          String(
            data.sender_id
          ) ===
          String(
            activeChatRef.current
          )

          ||

          String(
            data.receiver_id
          ) ===
          String(
            activeChatRef.current
          )

        ) {

          setMessages(
            (prev) => {

              const exists =
                prev.find(
                  (msg) =>
                    msg.id ===
                    data.id
                );

              if (exists)
                return prev;

              return [
                ...prev,
                data,
              ];
            }
          );
        }

        // LAST MESSAGE

        const userId =

          String(
            data.sender_id
          ) ===
            String(
              currentUserId
            )

            ? data.receiver_id
            : data.sender_id;

        setLastMessages(
          (prev) => ({
            ...prev,
            [userId]:
              data,
          })
        );

        // UNREAD

        if (

          String(
            data.sender_id
          ) !==
          String(
            currentUserId
          )

        ) {

          if (

            String(
              activeChatRef.current
            ) !==
            String(
              data.sender_id
            )

          ) {

            setUnreadCounts(
              (prev) => ({

                ...prev,

                [data.sender_id]:

                  (
                    prev[
                    data.sender_id
                    ] || 0
                  ) + 1,
              })
            );
          }
        }
      };

    socket.on(
      "receive_message",
      receiveMessage
    );

    // ================= ONLINE USERS =================

    socket.on(
      "online_users",
      (data) => {

        setOnlineUsers(
          data.users
        );
      }
    );

    // ================= TYPING =================

    socket.on(
      "typing",
      (data) => {

        setTypingUser(
          data.sender_id
        );
      }
    );

    socket.on(
      "stop_typing",
      () => {

        setTypingUser("");
      }
    );

    // ================= MESSAGE READ =================

    socket.on(
      "message_seen",
      (data) => {

        setMessages(
          (prev) =>

            prev.map(
              (msg) => {

                if (

                  String(
                    msg.sender_id
                  ) ===
                  String(
                    currentUserId
                  )

                  &&

                  String(
                    msg.receiver_id
                  ) ===
                  String(
                    data.receiver_id
                  )

                ) {

                  return {
                    ...msg,
                    is_read:
                      true,
                  };
                }

                return msg;
              }
            )
        );
      }
    );

    return () => {

      socket.off(
        "receive_message",
        receiveMessage
      );

      socket.off(
        "online_users"
      );

      socket.off(
        "typing"
      );

      socket.off(
        "stop_typing"
      );

      socket.off(
        "message_seen"
      );
    };

  }, [currentUserId]);

  // ================= AUTO SCROLL =================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      }
    );

  }, [messages]);

  // ================= SEND MESSAGE =================

  const sendMessage = () => {

    if (
      !message.trim()
    )
      return;

    if (!receiverId) {

      return alert(
        "Select User"
      );
    }

    socket.emit(
      "send_message",
      {
        receiver_id:
          receiverId,

        message,
      }
    );

    setMessage("");
  };

  // ================= HANDLE TYPING =================

  const handleTyping =
    (e) => {

      const value =
        e.target.value;

      setMessage(value);

      if (!receiverId)
        return;

      socket.emit(
        "typing",
        {
          receiver_id:
            receiverId,
        }
      );

      if (
        typingTimeoutRef.current
      ) {

        clearTimeout(
          typingTimeoutRef.current
        );
      }

      typingTimeoutRef.current =
        setTimeout(() => {

          socket.emit(
            "stop_typing",
            {
              receiver_id:
                receiverId,
            }
          );

        }, 1000);
    };

  // ================= TYPING USER =================

  const typingUserData =
    users.find(
      (u) =>
        String(u.id) ===
        String(typingUser)
    );

  // ================= AVATAR COLORS =================

  const getAvatarColor =
    (name = "") => {

      const colors = [

        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#06b6d4",
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
      ];

      const firstLetter =
        name.charAt(0).toUpperCase();

      const charCode =
        firstLetter.charCodeAt(0);

      return colors[
        charCode %
        colors.length
      ];
    };

  const handleUserLogout = async () => {
    try {
      setLogoutLoading(true)
      let res = await userLogout()
      if (res?.status?.code === 200) {
        setUserDetails(null)
        localStorage.removeItem("accesstoken")
        navigate("/")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLogoutLoading(false)
    }
  }

  return (

    <div className="chat-app-container">

      <div className="chat-wrapper">

        {/* SIDEBAR */}

        {showSidebar && (




          <div className="sidebar">

            <div className="logo">
              ChatRR
            </div>

            <div className="users-list">

              {users.map((u) => {

                const isOnline =
                  onlineUsers.includes(
                    u.id
                  );

                const lastMessage =
                  lastMessages[
                  u.id
                  ];

                return (

                  <div
                    key={u.id}
                    className={`user-card ${String(receiverId) ===
                      String(u.id)
                      ? "active"
                      : ""
                      }`}
                    onClick={() => {

                      setReceiverId(
                        u.id
                      );

                      if (
                        window.innerWidth <
                        768
                      ) {

                        setShowSidebar(
                          false
                        );
                      }
                    }}
                  >

                    <div
                      className="avatar"
                      style={{
                        background:
                          getAvatarColor(
                            u.user_name
                          ),
                      }}
                    >

                      {u.user_name
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                    <div className="user-info">

                      <div className="top-row">

                        <div className="user-name">

                          {u.user_name}

                        </div>

                        {isOnline && (

                          <div className="online-dot"></div>

                        )}

                      </div>

                      <div className="user-status">

                        {typingUser ===
                          u.id

                          ? "Typing..."

                          : lastMessage
                            ?.message ||
                          "Start chatting"}

                      </div>

                    </div>

                    {unreadCounts[
                      u.id
                    ] > 0 && (

                        <div
                          className="unread-count"
                        >

                          {
                            unreadCounts[
                            u.id
                            ]
                          }

                        </div>
                      )}

                  </div>
                );
              })}
            </div>

            {/* ADD THIS HERE */}

            <div className="sidebar-footer">

              <div className="current-user">

                <div
                  className="avatar"
                  style={{
                    background:
                      getAvatarColor(
                        userDetails?.user_name
                      ),
                  }}
                >
                  {userDetails?.user_name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div className="current-user-info">

                  <div className="current-user-name">
                    {userDetails?.user_name}
                  </div>

                  <div className="current-user-status">
                    Online
                  </div>

                </div>

              </div>

              <button
                onClick={handleUserLogout}
                className="logout-btn"
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <>
                    <span
                      className="
          spinner-border
          spinner-border-sm
        "
                      role="status"
                      aria-hidden="true"
                    ></span>

                    Logout...
                  </>
                ) : (
                  "Logout"
                )}

              </button>

            </div>

          </div>
        )}

        {/* CHAT AREA */}

        <div className="chat-area">

          {!receiverId ? (

            <div className="no-chat-selected">

              <div className="no-chat-box">

                <h2>
                  Welcome To ChatRR
                </h2>

                <p>
                  Select a user to start chatting
                </p>

              </div>

            </div>

          ) : (

            <>

              <div className="chat-header">

                <div>

                  <div className="chat-user-name">

                    {
                      selectedUser?.user_name
                    }

                  </div>

                  <div className="online-status">

                    {onlineUsers.includes(
                      receiverId
                    )

                      ? "Online"

                      : "Offline"}

                  </div>

                </div>

              </div>

              <div className="messages-container">

                {loadingMessages ? (

                  <div className="messages-loader">

                    <div className="loader-bubble"></div>
                    <div className="loader-bubble"></div>
                    <div className="loader-bubble"></div>

                  </div>

                ) : (

                  messages.map(
                    (msg) => {

                      const isMe =

                        String(
                          msg.sender_id
                        ) ===
                        String(
                          currentUserId
                        );

                      return (

                        <div
                          key={msg.id}
                          className={`message-row ${isMe
                            ? "me"
                            : "other"
                            }`}
                        >

                          <div
                            className={`message-bubble ${isMe
                              ? "my-message"
                              : ""
                              }`}
                          >

                            <div className="message-text">

                              {msg.message}

                            </div>

                            <div className="message-time">

                              {new Date(
                                msg.created_at
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour:
                                    "2-digit",

                                  minute:
                                    "2-digit",
                                }
                              )}

                              {isMe && (

                                <span
                                  className={`message-status ${msg.is_read
                                    ? "read"
                                    : msg.is_delivered
                                      ? "delivered"
                                      : "sent"
                                    }`}
                                >

                                  {msg.is_read
                                    ? "✓✓"

                                    : msg.is_delivered
                                      ? "✓✓"

                                      : "✓"}

                                </span>
                              )}

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />

              </div>

              {/* TYPING */}

              {typingUser && (

                <div className="typing-text">

                  <b>

                    {
                      typingUserData?.user_name
                    }

                  </b>{" "}

                  is typing...

                </div>
              )}

              {/* INPUT */}

              <div className="input-area">

                <input
                  value={message}
                  onChange={
                    handleTyping
                  }
                  onKeyDown={(e) => {

                    if (
                      e.key ===
                      "Enter"
                    ) {

                      sendMessage();
                    }
                  }}
                  placeholder="Type message..."
                  className="message-input"
                />

                <button
                  onClick={
                    sendMessage
                  }
                  className="send-btn"
                >
                  Send
                </button>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default ChatApp;