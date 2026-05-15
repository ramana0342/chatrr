import jwt from "jsonwebtoken";
import {
  saveMessage, markMessagesAsRead
} from "../models/chatModel.js";

import {
  messageId,
} from "../utils/idGenerator.js";

export const setupChatSocket = (io) => {

  // ================= ONLINE USERS =================

  const onlineUsers =
    new Map();

  // ================= EMIT ONLINE USERS =================

  const emitOnlineUsers =
    () => {

      io.emit(
        "online_users",
        {
          users:
            Array.from(
              onlineUsers.keys()
            ),
        }
      );
    };

  // ================= AUTH =================

  io.use(
    (socket, next) => {

      try {

        const token =
          socket.handshake
            .auth?.token;

        if (!token) {

          return next(
            new Error(
              "No token"
            )
          );
        }

        const decoded =
          jwt.verify(
            token,
            process.env
              .JWT_SECRET
          );

        socket.user =
          decoded;

        next();

      } catch (error) {

        console.log(
          error.message
        );

        next(
          new Error(
            "Unauthorized"
          )
        );
      }
    }
  );

  // ================= CONNECTION =================

  io.on(
    "connection",
    (socket) => {

      console.log(
        "Socket Connected:",
        socket.id
      );

      // ================= USER DATA =================

      const userId =
        socket.user.id;

      const user_name =
        socket.user
          .user_name;

      const name =
        socket.user.name;

      // ================= JOIN ROOM =================

      socket.join(
        userId.toString()
      );

      // ================= STORE ONLINE USER =================

      if (
        !onlineUsers.has(
          userId
        )
      ) {

        onlineUsers.set(
          userId,
          {
            userId,
            name,
            user_name,
            sockets:
              new Set(),
          }
        );
      }

      onlineUsers
        .get(userId)
        .sockets.add(
          socket.id
        );

      // EMIT ONLINE USERS

      emitOnlineUsers();

      console.log(
        `${name} joined`
      );

      // ================= SEND MESSAGE =================

      socket.on(
        "send_message",
        async (data) => {

          try {

            const messageData =
              {

                id: messageId(),

                sender_id:
                  userId,

                receiver_id:
                  data.receiver_id,

                message:
                  data.message,

                created_at:
                  new Date(),

                is_read:
                  false,

                is_delivered:
                  false,
              };

            // ================= CHECK RECEIVER ONLINE =================

            const isReceiverOnline =
              onlineUsers.has(
                data.receiver_id
              );

            if (
              isReceiverOnline
            ) {

              messageData.is_delivered =
                true;
            }

            // ================= SEND TO RECEIVER =================

            io.to(
              data.receiver_id.toString()
            ).emit(
              "receive_message",
              messageData
            );

            // ================= SEND TO SENDER =================

            io.to(
              userId.toString()
            ).emit(
              "receive_message",
              messageData
            );

            // ================= UPDATE SIDEBAR =================

            io.to(
              data.receiver_id.toString()
            ).emit(
              "sidebar_message",
              {
                sender_id:
                  userId,

                receiver_id:
                  data.receiver_id,

                message:
                  data.message,

                created_at:
                  new Date(),
              }
            );

            io.to(
              userId.toString()
            ).emit(
              "sidebar_message",
              {
                sender_id:
                  userId,

                receiver_id:
                  data.receiver_id,

                message:
                  data.message,

                created_at:
                  new Date(),
              }
            );

            // ================= SAVE MESSAGE =================

            saveMessage(
              messageData.id,
              userId,
              data.receiver_id,
              data.message
            ).catch(
              (error) => {

                console.log(
                  "SAVE MESSAGE ERROR:",
                  error.message
                );
              }
            );

          } catch (error) {

            console.log(
              "SEND MESSAGE ERROR:",
              error.message
            );
          }
        }
      );

      // ================= TYPING =================

      socket.on(
        "typing",
        (data) => {

          io.to(
            data.receiver_id.toString()
          ).emit(
            "typing",
            {
              sender_id:
                userId,
            }
          );
        }
      );

      // ================= STOP TYPING =================

      socket.on(
        "stop_typing",
        (data) => {

          io.to(
            data.receiver_id.toString()
          ).emit(
            "stop_typing",
            {
              sender_id:
                userId,
            }
          );
        }
      );

      // ================= MESSAGE READ =================

       // ================= MESSAGE READ =================

socket.on(
  "message_read",
  async (data) => {

    try {

      // UPDATE DATABASE

      await markMessagesAsRead(
        data.sender_id,
        userId
      );

      // SEND SEEN EVENT TO SENDER

      io.to(
        data.sender_id.toString()
      ).emit(
        "message_seen",
        {
          receiver_id:
            userId,
        }
      );

    } catch (error) {

      console.log(
        "MESSAGE READ ERROR:",
        error.message
      );
    }
  }
);

      // ================= DISCONNECT =================

      socket.on(
        "disconnect",
        () => {

          console.log(
            "Disconnected:",
            socket.id
          );

          const userData =
            onlineUsers.get(
              userId
            );

          if (
            userData
          ) {

            userData.sockets.delete(
              socket.id
            );

            if (
              userData.sockets
                .size === 0
            ) {

              onlineUsers.delete(
                userId
              );
            }

            emitOnlineUsers();
          }
        }
      );
    }
  );
};