import { createApp } from "vue";
import "./style.less";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

import App from "./App.vue";
import router from "./router";

createApp(App).use(router).use(ElementPlus,{locale:zhCn}).mount("#app");

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});
