const dahua = require('./index');
const fs = require('fs');

let cam_list = JSON.parse(fs.readFileSync('llista_ip.json').toString());
cam_list = cam_list["ip"];

(async()=>{
    for(let i = 0; i < cam_list.length; ++i){
        let cam = new dahua(cam_list[i], 80, "admin", "admin1234");
        let test = await cam.test_connection();
        console.log(test + ` ${cam_list[i]}`)
        let date = new Date();
        await cam.sync_time(date).then(resp => console.log(resp));
    }
})()

