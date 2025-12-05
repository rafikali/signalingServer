import { Server } from "socket.io"

const io = new Server({
  cors: { origin: "*" }
})

io.on("connection", socket => {
  console.log("User connected", socket.id)

  // Register user ID so we can message them
  socket.on("register", userId => {
    socket.join(userId)
  })

  // Caller starts call
  socket.on("start_call", data => {
    io.to(data.to).emit("incoming_call", {
      from: data.from,
      roomCode: data.roomCode
    })
  })

  // Receiver accepts
  socket.on("accept_call", data => {
    io.to(data.to).emit("call_accepted", data)
  })

  // Receiver rejects
  socket.on("reject_call", data => {
    io.to(data.to).emit("call_rejected", data)
  })

  // End call
  socket.on("end_call", data => {
    io.to(data.to).emit("call_ended")
  })
})

io.listen(3000)
console.log("Socket signaling server running on port 3000")
