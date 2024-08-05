import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const SocketListener = (props) => {
  // State để lưu trữ đối tượng socket
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Kết nối tới server Socket.io và cập nhật state socket
    const newSocket = socketIOClient('http://localhost:5000'); // Đảm bảo URL chính xác
    setSocket(newSocket);
    console.log('Connected to Socket.io');

    // Lắng nghe sự kiện 'orderCreated'
    newSocket.on('orderCreated', (eventData) => {
      console.log('Received orderCreated event:', eventData);
      setData(eventData);
      props.setNotificationsSocket(eventData);
    });

    newSocket.on('reviewCreated', (eventData) => {
      console.log('Received reviewCreated event:', eventData);
      setData(eventData);
      props.setNotificationsSocket(eventData);
    });

    // Ngắt kết nối khi component bị hủy
    return () => {
      newSocket.disconnect();
    };
  }, []);
        // {/** */}
        // <h1>Socket Status: {socket ? 'Connected' : 'Disconnected'}</h1>
        // {/* Hiển thị dữ liệu nhận được từ server */}
        // {data && <p>Data: {JSON.stringify(data)}</p>}

  return (
    <div>

    </div>
  );
};

export default SocketListener;