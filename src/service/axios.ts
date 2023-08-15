import axios from "axios";
import { ElNotification } from "element-plus";
// import { useTokenStore } from "@/store/token";
import router from "@/router";

//定义错误码
const CODEMESSAGE: { [key: number]: string } = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "登录失效，请重新登录",
  // 401: '用户没有权限（令牌、用户名、密码错误）。',
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "*",
    "Access-Control-Allow-Origin": "*",
  },
});

//请求拦截器
service.interceptors.request.use((config) => {
  let url = config.url as string;
  console.log(router.currentRoute.value.fullPath,"当前的页面路由")
  //添加时间戳
  if (url.indexOf("?") > -1) {
    url += `&_t=${new Date().getTime()}`;
  } else {
    url += `?_t=${new Date().getTime()}`;
  }
  //判断url是否存在_allow_anonymous
  //有的话直接移除这个参数,并发起请求
//   if (url.indexOf("_allow_anonymous=true") > -1) {
//     url = url.replace(/_allow_anonymous=true&?/, "");
//     config.url = url;
//     return config;
//   }
//   //判断是否存在token
//   if (useTokenStore().hasToken()) {
//     //存在token
//     config.headers["Authorization"] = `Bearer ${useTokenStore().getToken()}`;
//   } else {
//     //不存在token
//     //跳转到登录页面
//     if (router.currentRoute.value.fullPath !== "/login") {
//       router.push({path:"/login"});
//     }
//     //取消请求
//     return Promise.reject("请先登录！");
//   }
  config.url = url;
  return config;
});

//响应拦截器
service.interceptors.response.use(
  (response) => {
    return responseMap(response);
  },
  (error) => {
    return handleError(error);
  }
);

const responseMap = (response: any) => {
  if (!response) {
    return undefined;
  } else {
    return response.data as any;
  }
};

//错误处理
const handleError = (error: any) => {
  if (error.response) {
    const { status, statusText, data } = error.response;
    const errorMessage = data?.message || CODEMESSAGE[status];
    // if(status === 401 && location.pathname !== "/login") {
    // //   useTokenStore().clearToken();
    // //   router.push({path:"/login"});
    // }
    ElNotification({
      title: `错误 ${status} ${statusText}`,
      message: errorMessage,
      type: "error",
    });
  } else {
    ElNotification({
      title: "错误",
      message: error,
      type: "error",
    });
  }
  return Promise.reject(error);
};

//封装get请求
export const get = (url: string, params?: any) => {
  return service({
    url,
    method: "get",
    params,
  });
};

//封装post请求
export const post = (url: string, data?: any) => {
  return service({
    url,
    method: "post",
    data,
  });
};

//封装put请求
export const put = (url: string, data?: any) => {
  return service({
    url,
    method: "put",
    data,
  });
};

//封装delete请求
export const del = (url: string, params?: any) => {
  return service({
    url,
    method: "delete",
    params,
  });
};
