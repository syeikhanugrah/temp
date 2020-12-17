const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;

//Sturn
const signaling = new SignalingChannel(); // handles JSON.stringify/parse
const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const pc = new RTCPeerConnection(configuration);

// End const

// send any ice candidates to the other peer
pc.onicecandidate = ({candidate}) => signaling.send({candidate});

// let the "negotiationneeded" event trigger offer generation
pc.onnegotiationneeded = async () => {
  try {
    await pc.setLocalDescription();
    // send the offer to the other peer
    signaling.send({description: pc.localDescription});
  } catch (err) {
    console.error(err);
  }
};

pc.ontrack = ({track, streams}) => {
  // once media for a remote track arrives, show it in the remote video element
  track.onunmute = () => {
    // don't set srcObject again if it is already set.
    if (remoteView.srcObject) return;
    remoteView.srcObject = streams[0];
  };
};

// call start() to initiate
function start() {
  addCameraMic();
}

// add camera and microphone to connection
async function addCameraMic() {
  try {
    // get a local stream, show it in a self-view and add it to be sent
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    for (const track of stream.getTracks()) {
      pc.addTrack(track, stream);
    }
    selfView.srcObject = stream;
  } catch (err) {
    console.error(err);
  }
}

signaling.onmessage = async ({data: {description, candidate}}) => {
  try {
    if (description) {
      await pc.setRemoteDescription(description);
      // if we got an offer, we need to reply with an answer
      if (description.type == 'offer') {
        if (!selfView.srcObject) {
          // blocks negotiation on permission (not recommended in production code)
          await addCameraMic();
        }
        await pc.setLocalDescription();
        signaling.send({description: pc.localDescription});
      }
    } else if (candidate) {
      await pc.addIceCandidate(candidate);
    }
  } catch (err) {
    console.error(err);
  }
};

//End sturn

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/../build')));
}

let freeClients = new Set();
let searchingClients = new Set();

io.on('connection', socket => {
  freeClients.add(socket.id);
  socket.broadcast.emit('online', io.sockets.clients().server.eio.clientsCount);

  socket.on('message', entry => {
    const data = { sender: socket.id, msg: entry.msg };
    socket.emit('message', data);
    socket.to(entry.id).emit('message', data);
  });

  socket.on('signal', ({ signal, toId }) => {
    socket.to(toId).emit('signal', signal);
  });

  socket.on('typing', toId => {
    socket.emit('typing', socket.id);
    socket.to(toId).emit('typing', socket.id);
  });

  socket.on('stop typing', toId => {
    socket.emit('stop typing');
    socket.to(toId).emit('stop typing');
  });

  socket.on('searching', toId => {
    if (toId) {
      socket.to(toId).emit('stranger disconnected');
    } else {
      freeClients.delete(socket.id);
    }
    searchingClients.add(socket.id);
    const inSearch = Array.from(searchingClients);
    if (inSearch.length >= 2) {
      const toId = inSearch[0] !== socket.id ? inSearch[0] : inSearch[1];
      socket.emit('connected', { toId, initiator: false });
      socket.to(toId).emit('connected', { toId: socket.id, initiator: true });
      searchingClients.delete(socket.id);
      searchingClients.delete(toId);
    }
  });

  socket.on('stop', toId => {
    freeClients.add(socket.id);
    if (toId) {
      socket.to(toId).emit('stranger disconnected');
    } else {
      searchingClients.delete(socket.id);
    }
  });

  socket.on('online', cb => {
    return cb(io.sockets.clients().server.eio.clientsCount);
  });

  socket.on('disconnect', () => {
    if (freeClients.has(socket.id)) return freeClients.delete(socket.id);
    if (searchingClients.has(socket.id)) return searchingClients.delete(socket.id);
    socket.broadcast.emit('online', io.sockets.clients().server.eio.clientsCount);
  });
});
