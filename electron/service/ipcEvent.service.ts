import { app, ipcMain, IpcMainEvent } from "electron";
const evn = process.env.NODE_ENV;

export const registerIpcEvents = () => {
    //退出指令
  ipcMain.on("exitApp", (event, args) => {
    app.quit();
    event.returnValue = "OK";
  });
};
