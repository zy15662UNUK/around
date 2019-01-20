// 将主域名单独定义出来，不需要每次都写。到时候import之后用es6的模板语法
export const root = 'https://around-75015.appspot.com/api/v1';
export  const TOKEN_KEY = 'TOKEN_KEY';
export  const GEO_OPTIONS = {
    enableHighAccuracy: true,
    timeout           : 27000
};
export const POS_KEY = 'POS_KEY';
export const AUTH_HEADER = 'Bearer';
export const LOCATION_SHACKE = 0.02;