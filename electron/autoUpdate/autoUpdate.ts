import { autoUpdater } from "electron-updater";
import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";

export const autoUpdate = (config: any, win: BrowserWindow) => {
  //更新消息通知
  const sendUpdateMessage = (text: string) => {
    win.webContents.send("updateMessage", text);
  };

  //存在更新时自动下载
  autoUpdater.autoDownload = true;
  //APP退出时静默安装更新
  autoUpdater.autoInstallOnAppQuit = false;
  //更新检测地址
  autoUpdater.setFeedURL(config.uploadServe);

  // 当更新发生错误的时候触发
  autoUpdater.on("error", (err) => {
    console.log(err);
    // updateMessage(JSON.stringify(err))
  });
  // 发现可更新版本时触发
  autoUpdater.on("update-available", (info) => {
    console.log(info, "有新版本");
    // updateMessage('有新版本')
  });
  // 没有可更新版本时触发
  autoUpdater.on("update-not-available", (info) => {
    console.log(info, "无新版本");
    // updateMessage('无新版本')
  });

  // 更新包下载完成时触发
  autoUpdater.on("update-downloaded", () => {
    sendUpdateMessage("ok");
  });

  autoUpdater.checkForUpdates().catch((err) => {
    console.log("网络连接问题", err);
  });

  //收到前端允许安装指令时，执行安装
  ipcMain.on("update", async (event: IpcMainEvent, _args) => {
    autoUpdater.quitAndInstall();
    event.returnValue = "ok";
  });
};
