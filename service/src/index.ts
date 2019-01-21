import express from "express";
import { join } from "path";

let port = 3002;
let app = express();

// Inside electron production we serve also the gui from the service
if (process && process.env && process.env.ELECTRON_ENV === "production") {
    port = 3001; // The gui is served from here in production
    app.use(express.static(join(process.cwd(), "out/gui")));
}

// Get the port for the service
if (process && process.env && process.env.PORT) {
    port = parseInt(process.env.PORT, 10);
}

app.get("/api", (req, res) => {
    res.status(200).json({
        result: "Hello world from the service!"
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
