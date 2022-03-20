import { Socket } from "socket.io-client";

export const callUser = async (socket: Socket, socketId: string) => {
  console.log("CALL");
  const { RTCPeerConnection, RTCSessionDescription } = window;

  const peerConnection = new RTCPeerConnection();

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

  socket.emit("call-user", {
    offer,
    to: socketId,
  });
};
