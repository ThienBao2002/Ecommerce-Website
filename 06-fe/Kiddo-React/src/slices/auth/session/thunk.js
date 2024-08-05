import { createAsyncThunk } from '@reduxjs/toolkit';
import { sessionStarted, sessionEnded, sessionErrorOccurred, setSessionLoading, setDecodedToken } from './reducer';
import { jwtDecode } from "jwt-decode";

// Hàm kiểm tra tính hợp lệ của session
const isSessionValid = (sessionData) => {
  if (sessionData !== null) {
    sessionData = jwtDecode(sessionData);
  }
  try {
    if (!sessionData || typeof sessionData !== "object") {
      return false; // Trả về false nếu sessionData không tồn tại hoặc không phải là một đối tượng
    }

    const { exp } = sessionData;
    if (typeof exp !== "number" || exp <= Date.now() / 1000) {
      return false; // Trả về false nếu exp không phải là số hoặc đã hết hạn
    }

    return true; // Trả về true nếu session còn hợp lệ
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error checking session validity:", error);
    return false; // Trả về false nếu có lỗi
  }
};

// Thunk để kiểm tra và bắt đầu session
export const startSession = createAsyncThunk(
    'session/checkAndStartSession',
    async (_, { dispatch }) => {
      dispatch(setSessionLoading(true));
      try {
        const sessionData = sessionStorage.getItem("authUser");
        if (sessionData && isSessionValid(sessionData)) {
          dispatch(setDecodedToken(jwtDecode(sessionData))); // Set the decoded token here
          dispatch(sessionStarted());
        } else {
          throw new Error('Session is not valid');
        }
      } catch (error) {
        dispatch(sessionErrorOccurred(error.message));
      } finally {
        dispatch(setSessionLoading(false));
        // Gọi lại chính thunk startSession sau 30 giây
        // setTimeout(() => {
        //   dispatch(startSession());
        // }, 30000); // 30 seconds
      }
    }
  );

// Thunk để kết thúc session
export const endSession = createAsyncThunk(
  'session/endSession',
  async (_, { dispatch }) => {
    dispatch(sessionEnded());
    // Thêm bất kỳ logic nào cần thiết khi kết thúc session
  }
);
