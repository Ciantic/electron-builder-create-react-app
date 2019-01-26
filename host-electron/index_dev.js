process.env.ELECTRON_ENV = "development";

const { app } = require("electron");
const { Socket } = require("net");

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

// On development, the main window is opened once ports 3001, 3002 responds
process.stdout.write(
    "Development mode, you must start the service and gui, waiting for ports 3001 and 3002 to rise up...\n"
);

/**
 * Waits for a connection on port until resolving the promise
 *
 * @param opts {{ port: number }}
 */
const waitConnect = opts => {
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

Promise.all([waitConnect({ port: 3001 }), waitConnect({ port: 3002 })]).then(() => {
    require("ts-node").register();
    require("./src");
});
