import axios from 'axios';

// Cấu hình axios instance với base URL của backend API
const apiClient = axios.create({
  baseURL: 'http://localhost:5284/api', // Thêm /api vào base URL để khớp với backend
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Thêm timeout 10 giây để tránh chờ quá lâu
});

// Thêm interceptor để gắn token vào header của mỗi request
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;
