/// <reference path="../../node_modules/electron/electron.d.ts" />

import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { IpcRenderer, RendererInterface } from "electron";

// Access the Renderer interface and IpcRenderer like this
const renderer =
    "require" in window && ((window as any)["require"]("electron") as RendererInterface);
const ipcRenderer = renderer && (renderer.ipcRenderer as IpcRenderer);

class App extends Component {
    render() {
        console.log("IPC", ipcRenderer);
        console.log("Renderer", renderer);
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload!
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        );
    }
}

export default App;
