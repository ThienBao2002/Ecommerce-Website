import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const SocketListener = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Kết nối tới server Socket.io
    const socket = socketIOClient('http://localhost:5000'); // Đảm bảo URL chính xác

    console.log('Connected to Socket.io'); // Xác nhận rằng kết nối thành công

    // Lắng nghe sự kiện 'orderCreated'
    socket.on('orderCreated', (eventData) => {
      console.log('Received orderCreated event:', eventData); // Xác nhận đã nhận sự kiện
      setData(eventData); // Cập nhật dữ liệu
    });

    // Ngắt kết nối khi component bị hủy
    return () => {
      socket.disconnect();
    };
  }, []); // Chạy một lần khi component được tạo

  return (
    <div>
      <h1>Socket.io Listener</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>} {/* Hiển thị dữ liệu */}
    </div>
  );
};

export default SocketListener;