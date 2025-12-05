import { Server } from "socket.io";

const io = new Server({ cors: { origin: "*" } });

io.on("connection", socket => {
  console.log("User connected", socket.id);

  socket.on("register", userId => {
    socket.data.userId = userId;
    socket.join(userId);
  });

  socket.on("start_call", data => {
    io.to(data.to).emit("incoming_call", {
      from: data.from,
      to: data.to,
      roomCode: data.roomCode,
    });
  });

  socket.on("accept_call", data => {
    io.to(data.from).emit("call_accepted", {
      from: data.to,
      to: data.from,
      roomCode: data.roomCode,
    });
  });

  socket.on("reject_call", data => {
    io.to(data.from).emit("call_rejected", {
      from: data.to,
      to: data.from,
      roomCode: data.roomCode,
    });
  });

  socket.on("end_call", data => {
    io.to(data.to).emit("call_ended", {
      from: data.from,
      to: data.to,
      roomCode: data.roomCode,
    });
  });

  socket.on("sdp_offer", data => io.to(data.to).emit("sdp_offer", data));
  socket.on("sdp_answer", data => io.to(data.to).emit("sdp_answer", data));
  socket.on("ice_candidate", data =>
    io.to(data.to).emit("ice_candidate", data),
  );
});

io.listen(process.env.PORT || 3000)
console.log("Socket signaling server running on port " + (process.env.PORT || 3000))

