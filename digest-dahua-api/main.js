const dahua = require('./index');

let cam = new dahua("192.168.1.108", "80", "admin", "admin1234");

(async()=>{
    let test = await cam.test_connection();
    console.log("Test: " + test);
})()

let date = new Date();
//cam.set_ip("192.168.1.108").then(resp => console.log(resp)).catch(e => console.log(e))




cam.sync_time(date);