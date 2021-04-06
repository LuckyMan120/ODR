

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

export default function({$config}, inject) {
  const io = sailsIOClient(socketIOClient);

  io.sails.transports = ['websocket'];
  io.sails.environment = $config.NODE_ENV;

  io.socket.on('disconnect', () => {
    io.socket._raw.io._reconnection = true;
  });

  inject('io', io);
}
