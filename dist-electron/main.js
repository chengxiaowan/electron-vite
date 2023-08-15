"use strict";
const electron = require("electron");
const yaml = require("js-yaml");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const electronUpdater = require("electron-updater");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const fse__namespace = /* @__PURE__ */ _interopNamespaceDefault(fse);
const commonService = () => {
  const env2 = process.env.NODE_ENV;
  const initApp = async () => {
    let intallConfigPath = path.join(process.resourcesPath, "hyjg");
    const appDataPath = electron.app.getPath("appData");
    if (env2 == "development") {
      intallConfigPath = path.join(__dirname, "../assets/config.yml");
    }
    if (!fs__namespace.existsSync(`${appDataPath}/hyjg/config.yml`) && env2 != "development") {
      console.log("拷贝文件到appData");
      fse__namespace.copySync(intallConfigPath, `${appDataPath}/hyjg`);
    }
  };
  const readConfig = async () => {
    const appDataPath = electron.app.getPath("appData");
    let configPath = env2 == "development" ? path.join(__dirname, "../assets/config.yml") : path.join(appDataPath, "hyjg", "config.yml");
    return yaml.load(fs__namespace.readFileSync(configPath, "utf8")) || {};
  };
  return {
    initApp,
    readConfig
  };
};
const autoUpdate = (config2, win2) => {
  const sendUpdateMessage = (text) => {
    win2.webContents.send("updateMessage", text);
  };
  electronUpdater.autoUpdater.autoDownload = true;
  electronUpdater.autoUpdater.autoInstallOnAppQuit = false;
  electronUpdater.autoUpdater.setFeedURL(config2.uploadServe);
  electronUpdater.autoUpdater.on("error", (err) => {
    console.log(err);
  });
  electronUpdater.autoUpdater.on("update-available", (info) => {
    console.log(info, "有新版本");
  });
  electronUpdater.autoUpdater.on("update-not-available", (info) => {
    console.log(info, "无新版本");
  });
  electronUpdater.autoUpdater.on("update-downloaded", () => {
    sendUpdateMessage("ok");
  });
  electronUpdater.autoUpdater.checkForUpdates().catch((err) => {
    console.log("网络连接问题", err);
  });
  electron.ipcMain.on("update", async (event, _args) => {
    electronUpdater.autoUpdater.quitAndInstall();
    event.returnValue = "ok";
  });
};
process.env.NODE_ENV;
const registerIpcEvents = () => {
  electron.ipcMain.on("exitApp", (event, args) => {
    electron.app.quit();
    event.returnValue = "OK";
  });
};
const env = process.env.NODE_ENV;
let config = {};
let win;
const createWindow = async () => {
  win = new electron.BrowserWindow({
    webPreferences: {
      devTools: true,
      // 集成网页和 Node.js，也就是在渲染进程中，可以调用 Node.js 方法
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    fullscreen: config.fullscreen,
    width: config.width,
    height: config.height
  });
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
electron.app.whenReady().then(async () => {
  const { initApp, readConfig } = commonService();
  await initApp();
  config = await readConfig();
}).then(async () => {
  await createWindow();
}).then(async () => {
  autoUpdate(config, win);
});
