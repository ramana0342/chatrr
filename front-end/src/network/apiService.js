import axiosInstance from "./axiosInstance";

export const getRequest = (url, { params = {}, config = {} } = {}) => {
  return axiosInstance.get(url, {
    params,
    ...config,
  });
};

export const postRequest = (url, { data = {}, config = {} } = {}) => {
  return axiosInstance.post(url, data, config);
};

export const putRequest = (url, { data = {}, config = {} } = {}) => {
  return axiosInstance.put(url, data, config);
};

export const deleteRequest = (url, { data = {}, config = {} } = {}) => {
  return axiosInstance.delete(url, {
    data,
    ...config,
  });
};