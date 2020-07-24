const dahua_initializer = require('./index');
const fs = require('fs');

let rawData = fs.readFileSync('DH-IPC-HFW2230SP-S-S2.json').toString();
let camera_config = JSON.parse(rawData);
(async()=>{
    await dahua_initializer({"screenshots" : false, "headless": false}, camera_config);
    console.log("JAJAJA")
})()
