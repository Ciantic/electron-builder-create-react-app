# Electron application, with decoupled Create React App and web service e.g. REST

Author: Jari Pennanen, 2019

License: Public Domain

Idea of this template is to show how to make a decoupled create-react-app and web service running in electron host.

1. `gui` - contains the basic create-react-app
2. `host-electron` - contains the electron application
3. `service` - contains the web service e.g. REST API for your GUI

GUI is supposed to work through normal website as well as electron host, but when started in electron it also serves the GUI and the web service in one same process.

## Start development example:

First, run `yarn install` in root, it should install (🤞) all the dependencies with yarn workspaces feature:

Then run `yarn start` in the root, it will start _all_ three in development mode.

## Build a Windows bundle example:

Make sure you have installed dependencies as before with yarn.

Then run `yarn build`, it should create fully functional Windows portable `host-electron\dist\win-unpacked\host-electron.exe` inside which starts all three services.
