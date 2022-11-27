import { app, BrowserWindow } from "electron"
import { join } from "path"
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer"

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  })

  if (app.isPackaged) {
    win.loadURL(`file://${__dirname}/../index.html`)
  } else {
    win.loadURL("http://localhost:3000/index.html")

    win.webContents.openDevTools()

    require("electron-reload")(__dirname, {
      electron: join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron" + (process.platform === "win32" ? ".cmd" : "")
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    })
  }
}

app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err))

  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit()
    }
  })
})
