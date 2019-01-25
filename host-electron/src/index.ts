import { app, BrowserWindow } from "electron";
import { Socket, TcpSocketConnectOpts } from "net";

const dev = process.env.ELECTRON_ENV && process.env.ELECTRON_ENV === "development";

// On production, this promise just runs directly
let wait = () => new Promise(res => res());

if (!dev) {
    // On production the web-service is included as part of electron application, also the gui is
    // injected in the service url
    require("service");
} else {
    // On development, the main window is opened once ports 3001, 3002 responds
    process.stdout.write(
        "Development mode, you must start the service and gui, waiting for ports 3001 and 3002 to rise up...\n"
    );

    /**
     * Waits for a connection on port until resolving the promise
     *
     * @param param0
     */
    let waitConnect = (opts: TcpSocketConnectOpts) => {
        return new Promise((res, rej) => {
            let n = 0;
            let conn = () => {
                if (n > 20) {
                    // wait 20 seconds
                    rej();
                    return;
                }
                n++;
                let c = new Socket();
                c.connect(opts)
                    .on("connect", () => {
                        c.end();
                        res();
                        process.stdout.write(`Port ${opts.port} is now accepting connections...\n`);
                    })
                    .on("error", () => {
                        // Try after 1000 milliseconds
                        setTimeout(conn, 1000);
                    });
            };
            conn();
        });
    };
    wait = () => Promise.all([waitConnect({ port: 3001 }), waitConnect({ port: 3002 })]);
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    wait()
        .then(createWindow)
        .catch(() => {
            process.stdout.write("Quitting: GUI and Service was not started...\n");
            app.quit();
        });
});

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
