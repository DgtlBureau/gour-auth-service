import axios from 'axios';

// import AuthService from '../services/AuthService';
// import { eventBus, EventTypes } from "../services/EventBus";
import { HTTP_SUCCESS, HTTP_UNAUTHORIZED } from "./httpConstants";
// import { eraseCookie } from '../utils/cookie';
// import { showInformationMessage } from '../components/notification/messages';

const $api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

let isRetrying: Promise<void> | undefined = undefined;

const exceptions = [
  '/auth/refresh',
  '/auth/signin',
  '/auth/signup',
];

// $api.interceptors.response.use(
//
//   config => {
//     return config;
//   },
//
//   async error => {
//
//     const originalRequest = error.config;
//
//     if (!originalRequest || error?.response?.status !== HTTP_UNAUTHORIZED) {
//       throw error;
//     }
//
//     console.log(originalRequest.url);
//
//     if (exceptions.includes(originalRequest.url)) {
//       throw error
//     }
//
//     if (isRetrying) {
//       await isRetrying
//       return $api.request(originalRequest);
//     }
//
//     isRetrying = new Promise(async (resolve, reject) => {
//
//       try {
//
//         const { data, status } = await AuthService.refresh();
//
//         if (status === HTTP_SUCCESS) {
//           resolve();
//         } else {
//           // eraseCookie('isLogged')
//           // showInformationMessage('Время сессии истекло, пожалуйста, авторизуйтесь снова')
//           reject();
//         }
//
//       } catch (error) {
//         // eraseCookie('isLogged')
//         // showInformationMessage('Время сессии истекло, пожалуйста, авторизуйтесь снова')
//         reject(error);
//       }
//     });
//
//     try {
//
//       await isRetrying;
//       isRetrying = undefined;
//       return await $api.request(originalRequest);
//
//     } catch (e) {
//
//       isRetrying = undefined;
//       // eventBus.emit(EventTypes.routerPush, '/signin')
//       throw e;
//     }
//   }
// );

export default $api;
