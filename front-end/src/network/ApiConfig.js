const chatrrBaseURL = 'chatrr/api'

const getBaseURL = () => {
  const host = window.location.hostname;

  if (host === "localhost" || host === "127.0.0.1") {
    return `http://localhost:5000/${chatrrBaseURL}`;
  }

  return `https://chatrr-api.onrender.com/${chatrrBaseURL}`;

};

export default getBaseURL;

export const getSocketURL = () => {
  const host = window.location.hostname;

  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5000";
  }

  return "https://chatrr-api.onrender.com";
};