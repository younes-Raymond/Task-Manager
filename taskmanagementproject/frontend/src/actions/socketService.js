// socketService.js
import { useEffect } from 'react';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:4000');

export const useSocket = (eventName, callback) => {
  useEffect(() => {
    const handler = (data) => {
      if (callback) {
        callback(data);
      }
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [eventName, callback]);
};
