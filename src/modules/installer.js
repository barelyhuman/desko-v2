// Imports

import { parse as urlparse } from "url";
var os = require("os");
var fs = require("fs");
var axios = require("axios");
var { spawn } = require("child_process");
var request = require("request");

//Global Declarations
var tarball_regex = new RegExp("((http|https)(://.+)(\\w+.*.tar.gz))", "gi");
var appImage_regex = new RegExp("((http|https)(://.+)(\\w+.*.AppImage))", "gi");
var download_dir = os.homedir() + "/desko_downloads";

//Resolve Directory
if (!fs.existsSync(download_dir)) {
  fs.mkdirSync(download_dir);
}

//Check If Package is in Repo
function checker(data, modalStateHandler, setRequest) {
  modalStateHandler(true, "searching", "0");
  setTimeout(function() {
    if (data.inRepo) {
      console.log("Available In Repo, Installing");
      modalStateHandler(true, "installing", "40");
      nativePackager(data.packageName);
    } else {
      console.log("Not in repo, Downloading");
      downloader(
        data.packageName,
        data.srcUrl,
        data.type,
        modalStateHandler,
        setRequest
      );
    }
  }, 1000);
}

//Native Packager for In Repo Applications
function nativePackager(pkgName) {
  console.log(pkgName);
}

//Downloader to download based on Type of package
function downloader(name, url, type, modalStateHandler, setRequest) {
  if (type === "git-api-appimage") {
    getGitPackage(name, url, modalStateHandler, appImage_regex, setRequest);
  } else if (type === "git-api-tar") {
    getGitPackage(name, url, modalStateHandler, tarball_regex, setRequest);
  } else if (type === "direct-tar") {
    getDirectPackage(name, url, modalStateHandler, setRequest);
  } else if (type === "git-clone") {
    gitClone(name, url, modalStateHandler, setRequest);
  }
}

//Git Package Cloner
function gitClone(name, url, modalStateHandler, setRequest) {
  var file = download_dir + "/" + name;
  if (fs.existsSync(file)) {
    modalStateHandler(true, "file exists", "100");
  } else {
    const clone = spawn(
      "git",
      ["clone", "--progress", url, download_dir + "/" + name],
      { detached: true }
    );
    setRequest(clone);
    clone.stderr.on("data", data => {
      var regex = new RegExp("(Receiving objects:.+)(\\d+)%", "gi");
      var percent = data.toString().match(regex);
      if (percent) {
        var progress = percent[0].toString().replace("Receiving objects:", "");
        progress = progress.replace("%", "");
        console.log(progress);
        modalStateHandler(true, "downloading", progress);
      }
    });
    clone.stdout.on("data", data => {
      console.log("data: " + data);
    });
    clone.on("close", data => {
      console.log("finished");
      modalStateHandler(false, "", "");
    });
  }
}

//Direct Package Retriever
function getDirectPackage(name, url, modalStateHandler, setRequest) {
  var file = download_dir + "/" + name;
  console.log(name);
  url = urlparse(url);

  var r = request({ url: url, followAllRedirects: true }, function(
    err,
    data,
    body
  ) {
    installer(file, modalStateHandler);
  }).on("response", resp => {
    url = resp.request.href;
    console.log(url);
    var contentLength = parseInt(resp.headers["content-length"], 10);
    var progress = 0;
    var received = 0;
    resp.on("data", data => {
      received += data.length;
      progress = received / contentLength * 100;
      progress = progress.toFixed(2);
      modalStateHandler(true, "downloading", progress.toString());
    });
  });
  r.pipe(fs.createWriteStream(file));
  setRequest(r);
}

//Get Package for Git Api
function getGitPackage(name, url, modalStateHandler, regex, setRequest) {
  var file = download_dir + "/" + name;
  file = file.toString();
  axios.get(url).then(function(res) {
    var urllist = [];
    var downurl;
    var assets = res.data.assets;
    for (let i of assets) {
      urllist.push(i.browser_download_url);
    }
    for (let i of urllist) {
      if (i.toString().match(regex)) {
        downurl = i;
      }
    }

    console.log(downurl);
    modalStateHandler(true, "searching", "100");
    var r = request(downurl, function(err, res, body) {
      installer(file, modalStateHandler);
    }).on("response", resp => {
      console.log(resp);
      var contentLength = parseInt(resp.headers["content-length"], 10);
      var progress = 0;
      var received = 0;
      resp.on("data", data => {
        received += data.length;
        progress = received / contentLength * 100;
        progress = progress.toFixed(2);
        modalStateHandler(true, "downloading", progress.toString());
      });
    });
    r.pipe(fs.createWriteStream(file));
    setRequest(r);
  });
}

//Check and Install package
function installer(file, modalStateHandler) {
  console.log(file);
  modalStateHandler(true, "installing", "0");
}

//Export Main Function
export { checker };
