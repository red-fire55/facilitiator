"use strict";

// Import parts of electron to use
let { app, BrowserWindow, ipcMain } = require("electron");
let path = require("path");
let url = require("url");
let fs = require("fs");
let fse = require("fs-extra");
let toBuffer = require("blob-to-buffer");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let secWindow;
// Keep a reference for dev mode
let dev = false;

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  dev = true;
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  secWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  let indexPath;

  if (dev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  let secPath = url.format({
    protocol: "file:",
    pathname: path.join(__dirname, "sec.html"),
    slashes: true,
  });

  mainWindow.loadURL(indexPath);
  secWindow.loadURL(secPath);
  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    secWindow.show();
    // Open the DevTools automatically if developing
    if (dev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    secWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

//turn blobs back
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var _ia = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
    _ia[i] = byteString.charCodeAt(i);
  }

  var dataView = new DataView(arrayBuffer);
  var blob = new Blob([dataView], { type: mimeString });
  return blob;
}

//listeners
ipcMain.on("show-img", (e, data) => {
  secWindow.webContents.send("img-sent", data.img);
});

ipcMain.on("hide-img", (e, data) => {
  secWindow.webContents.send("img-hide", data.img);
});

ipcMain.on("open-msg", (e, data) => {
  secWindow.webContents.send("msg-show", data.msg);
});

ipcMain.on("show-words", (e, data) => {
  secWindow.webContents.send("words-show", data);
});

ipcMain.on("hide-words", (e, data) => {
  secWindow.webContents.send("words-hide", data);
});

let toWav = require("audiobuffer-to-wav");
let DownloadManager = require("electron-download-manager");

ipcMain.on("save", (e, data) => {
  let dir = data.session;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    fs.writeFile(
      path.join(
        __dirname,
        data.session,
        `elabsed times for session ${data.session}.json`
      ),
      JSON.stringify(data.info),
      () => {
        console.log("saved succefully");
      }
    );
    ipcMain.on("SAVE-FILE", (event, fileName, buffer) => {
      fse.outputFile(
        path.join(__dirname, data.session, fileName),
        buffer,
        (err) => {
          if (err) {
            event.sender.send("ERROR", err.message);
          } else {
            event.sender.send("SAVED-FILE", path.join(__dirname, "hello"));
          }
        }
      );
    });
    ipcMain.on("SAVE-FILE2", (event, fileName, buffer) => {
      fse.outputFile(
        path.join(__dirname, data.session, fileName),
        buffer,
        (err) => {
          if (err) {
            event.sender.send("ERROR", err.message);
          } else {
            event.sender.send("SAVED-FILE", path.join(__dirname, "hello"));
          }
        }
      );
    });
  }
});
