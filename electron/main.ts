import { app, BrowserWindow } from "electron";
import path from "path";
import { commonService } from "./service/common.service";
import { autoUpdate } from "./autoUpdate/autoUpdate";
import { registerIpcEvents } from "./service/ipcEvent.service";


//获取当前环境
const env = process.env.NODE_ENV;
//配置
let config: any = {};
//窗口对象
let win: BrowserWindow;

const createWindow = async () => {
  win = new BrowserWindow({
    webPreferences: {
      devTools: true,
      // 集成网页和 Node.js，也就是在渲染进程中，可以调用 Node.js 方法
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    fullscreen:config.fullscreen,
    width: config.width,
    height: config.height,
  });

  //加载页面
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile("dist/index.html");
  }

  if (env === "development" || config.openDevTools) {
    win.webContents.openDevTools();
  }

  registerIpcEvents();
};

app
  .whenReady()
  .then(async () => {
    const { initApp, readConfig } = commonService();
    //初始化应用
    await initApp();
    //读取配置
    config = await readConfig();
  })
  .then(async () => {
    //创建窗口
    await createWindow();
  })
  .then(async () => {
    //自动更新
    autoUpdate(config, win);
  })
