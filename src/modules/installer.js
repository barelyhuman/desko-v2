import { parse as urlparse } from "url";

var fs = require("fs");
var axios = require("axios");
// var { spawn } = require("child_process");
var request = require("request");

var tar_link_regex = new RegExp("((http|https)(://.+)(w+.*.tar.gz))", "gi");

function checker(data, modalStateHandler) {
  modalStateHandler(true, "searching", "0");
  setTimeout(function() {
    if (data.inRepo) {
      console.log("Available In Repo, Installing");
      modalStateHandler(true, "installing", "40");
      nativePackager(data.packageName);
    } else {
      console.log("Not in repo, Downloading");
      downloader(data.packageName, data.srcUrl, data.type, modalStateHandler);
    }
  }, 1000);
}

function nativePackager(pkgName) {
  console.log(pkgName);
}

function downloader(name, url, type, handler) {
  if (type === "git") {
    // gitClone(name, url, handler);
  } else if (type === "tarball") {
    getPackage(name, url, handler);
  }
}

function getPackage(name, url, handler) {
  var download_dir = "./downloads";
  if (!fs.existsSync(download_dir)) {
    fs.mkdirSync(download_dir);
  }
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
      if (i.toString().match(tar_link_regex)) {
        downurl = i;
      }
    }
    console.log(downurl);

    //  handler(true, "downloading", "0");
    request(downurl, function(err, res, body) {})
      .on("response", resp => {
        console.log(resp);
        var contentLength = parseInt(resp.headers["content-length"], 10);
        var progress = 0;
        var received = 0;
        resp.on("data", data => {
          received += data.length;
          progress = received / contentLength * 100;
          progress = progress.toFixed(2);
          handler(true, "downloading", progress.toString());
        });
      })
      .on("close", () => {
        installer(file);
      })
      .pipe(fs.createWriteStream(file));
  });
}

function installer(file) {
  console.log(file);
}
export { checker };
