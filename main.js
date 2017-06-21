var { app, BrowserWindow } = require("electron");

let window = null;

app.on("ready", function() {
  win = new BrowserWindow({
    title: "Desko",
    height: 550,
    width: 450,
    minHeight: 550,
    minWidth: 450,
    maxHeight: 550,
    maxWidth: 450,
    frame: false
  });
  win.setResizable(false);
  win.loadURL("file://" + __dirname + "/index.html");
});
