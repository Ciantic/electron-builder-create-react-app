import { app, BrowserWindow } from "electron";

const dev = process.env.ELECTRON_ENV && process.env.ELECTRON_ENV === "development";

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
    if (dev) {
        process.stdout.write("Opening the electron window\n");
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    // and load the index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, "../index.html"));
    mainWindow.loadURL("http://localhost:3001");

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// On development the ready maybe already called
if (app.isReady()) {
    createWindow();
} else {
    app.on("ready", createWindow);
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
