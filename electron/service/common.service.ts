import { app } from "electron";
import yaml from "js-yaml";
import path from "path";
import * as fs from "fs";
import * as fse from "fs-extra";

export const commonService = () => {
  const env = process.env.NODE_ENV;

  //初始化APP配置
  const initApp = async () => {
    //安装目录下的配置文件目录
    let intallConfigPath = path.join(process.resourcesPath, "hyjg");
    //appData目录
    const appDataPath = app.getPath("appData");

    //如果是开发环境，配置文件目录为项目根目录下的/assets/config.yml
    if (env == "development") {
      intallConfigPath = path.join(__dirname, "../assets/config.yml");
    }

    //如果appData没有配置文件,且不在开发环境下 则复制配置文件到appData
    if (
      !fs.existsSync(`${appDataPath}/hyjg/config.yml`) &&
      env != "development"
    ) {
      console.log("拷贝文件到appData");
      fse.copySync(intallConfigPath, `${appDataPath}/hyjg`);
    }
  };

  //读取配置文件
  const readConfig = async () => {
    const appDataPath = app.getPath("appData");
    let configPath =
      env == "development"
        ? path.join(__dirname, "../assets/config.yml")
        : path.join(appDataPath, "hyjg", "config.yml");
    return yaml.load(fs.readFileSync(configPath, "utf8")) || {};
  };

  return {
    initApp,
    readConfig,
  };
};
