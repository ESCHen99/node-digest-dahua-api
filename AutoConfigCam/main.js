const dahuaInitializer = require("dahua_initializer");
const fs = require("fs");
const readline = require('readline');

let rawData = fs.readFileSync("DH-IPC-HFW2230SP-S-S2.json").toString();
let camera_config = JSON.parse(rawData);

(async()=>{
    await dahuaInitializer({"screenshot": true, "path": '.', "headless": false}, camera_config);
})()