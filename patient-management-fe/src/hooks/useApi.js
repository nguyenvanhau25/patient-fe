import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook tùy chỉnh để xử lý các yêu cầu API với trạng thái loading, error và data.
 *
 * @param {Function} apiFunc - Hàm API để gọi (ví dụ từ utils/api.js)
 * @param {boolean} immediate - Có thực thi hàm ngay khi mount hay không
 * @returns {Object} { data, loading, error, execute, setData }
 */
export const useApi = (apiFunc, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Sử dụng ref để lưu apiFunc mới nhất nhằm tránh render lại vô hạn
  // nếu truyền vào một hàm ẩn danh trực tiếp trong component
  const apiFuncRef = useRef(apiFunc);
  
  useEffect(() => {
    apiFuncRef.current = apiFunc;
  }, [apiFunc]);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFuncRef.current(...args);
      // Hỗ trợ phản hồi từ Axios có .data, hoặc trả về dữ liệu trực tiếp
      const responseData = response?.data !== undefined ? response.data : response;
      setData(responseData);
      return responseData;
    } catch (err) {
      console.error('API Error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Đã xảy ra lỗi, vui lòng thử lại sau.';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
};

export default useApi;
