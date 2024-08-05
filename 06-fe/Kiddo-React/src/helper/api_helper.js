import axios from "axios";
import { api } from "../config";

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const token = JSON.parse(sessionStorage.getItem("authUser"))
  ? JSON.parse(sessionStorage.getItem("authUser")).token
  : null;
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Cập nhật cách lấy status từ error.response
    const statusCode = error.response ? error.response.status : 0;

    let message = "An unexpected error occurred"; // Tin nhắn mặc định

    switch (statusCode) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        // Cập nhật để lấy thông điệp từ phản hồi của server hoặc từ error.message
        message = error.response?.data?.message || error.message || "Unknown error";
        break;
    }

    // Trả về Promise reject với đối tượng lỗi có chứa thông điệp và mã trạng thái
    return Promise.reject({ message, statusCode });
  }
);

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params) => {
    // Sử dụng axios.get với cách tiếp cận đúng đắn hơn
    const config = {
      withCredentials: true, // Chỉ cần thiết lập withCredentials
      params: params, // Chuyển params như một đối tượng
    };

    return axios.get(url, config);
  };
  getById = (url, id, params) => {
    const requestUrl = id ? `${url}/${id}` : url;
    const config = {
      withCredentials: true, // Chỉ cần thiết lập withCredentials
      params: params, // Chuyển params như một đối tượng
    };

    return axios.get(requestUrl, config);
  };
  /**
   * post given data to url
   */
  createFormData = (url, formData) => {
    return axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Đảm bảo đặt Content-Type là 'multipart/form-data'
      },
      withCredentials: true, // Bật withCredentials để gửi cookie và thông tin xác thực
    });
  };

  create = (url, data) => {
    return axios.post(url, data, {
      withCredentials: true, // Bật tính năng gửi cookie và thông tin xác thực
      credentials: "include",
    });
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data, {
      withCredentials: true, // Bật tính năng gửi cookie và thông tin xác thực
      credentials: "include",
    });
  };
  updateFormData = (url, formData) => {
    return axios.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Bật tính năng gửi cookie và thông tin xác thực
      credentials: "include",
    });
  };

  put = (url, data) => {
    return axios.put(url, data, {
      withCredentials: true, // Bật tính năng gửi cookie và thông tin xác thực
      credentials: "include",
    });
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(
      url,
      { ...config },
      {
        withCredentials: true, // Bật tính năng gửi cookie và thông tin xác thực
        credentials: "include",
      }
    );
  };
  patch = (url, data) => {
    return axios.patch(url, data, {
      withCredentials: true, // Bật tính năng gửi cookie và thông tin xác thực
      credentials: "include",
    });
  };
  deleteWithBody = (url, data) => {
    return axios.delete(url, {
      data: data, // Gửi data trong body của yêu cầu DELETE
      withCredentials: true, // Bật tính năng gửi cookie và thông tin xác thực
      credentials: 'include',
    });
  };
}
const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    console.log("No user found in localStorage");
    return null;
  } else {
    const parsedUser = JSON.parse(user);
    sessionStorage.setItem("authUser", user);  // Only set this when necessary, not every time
    return parsedUser;
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
