import { defineStore } from "pinia";
import { ref } from "vue";

export const useRequstPathStore = defineStore("requestPath", () => {
  const requestPathList = ref<any[]>([]);

  // 设置请求路径列表
  const setRequstPathList = (list: any[]) => {
    requestPathList.value = list;
  };

  // 获取请求路径列表
  const getRequstPathList = () => {
    return requestPathList.value;
  };

  // 根据id获取请求路径
  const getPathById = (id: string) => {
    return requestPathList.value.find((item) => item.id === id);
  };

  return {
    requestPathList,
    setRequstPathList,
    getRequstPathList,
    getPathById,
  };
});
