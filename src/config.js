// src/config.js
//const localApiHost = 'http://localhost/slang-sharing-backend/api';
const productionApiHost = process.env.REACT_APP_API_HOST;

const config = {
    apiHost: productionApiHost,
};

//apiHost: process.env.NODE_ENV === 'production' ? productionApiHost : localApiHost,
export default config;