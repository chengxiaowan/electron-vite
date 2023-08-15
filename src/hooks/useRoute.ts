import { useRouter as useVueRouter, useRoute as useVueRoute } from "vue-router";
/**
 * 路由跳转
 * @returns router路由对象 navigateTo跳转方法
 */
export function useRoute() {
  const router = useVueRouter();
  const route = useVueRoute();

  /**
   * 路由跳转
   * @param path 路由地址
   * @param params 携带参数
   */
  const navigateTo = (path: string, params = {}) => {
    router.push({ path, query: params });
  };
  
  return { route,router, navigateTo };
}
