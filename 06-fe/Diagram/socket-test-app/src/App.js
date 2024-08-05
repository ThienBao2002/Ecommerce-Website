import React from 'react';
import SocketListener from './component/socketListener'; // Đường dẫn tới component lắng nghe Socket.io

const App = () => {
  return (
    <div>
      <h1>Socket.io Test Application</h1>
      <SocketListener /> {/* Sử dụng component để lắng nghe sự kiện */}
    </div>
  );
};

export default App;