const dahua_initializer = require('dahua_initializer');
const fs = require('fs');
const dahua = require('./index');
const readline = require('readline');


async function main(){
    let camera_config = JSON.parse(fs.readFileSync('DH-IPC-HFW2230SP-S-S2.json').toString());
    let ip_list = JSON.parse(fs.readFileSync('llista_ip.json').toString());
    ip_list = ip_list["ip"];
    let state = 0;
    let cam;
    let i = 0;
    let first = true;
    while ( i < ip_list.length){
        switch (state) {
            case 0:
                cam = new dahua("192.168.1.108", 80, "admin", "admin1234");
                if (await cam.test_connection()){
                    state = 10;
                    first = true;
                    console.log("Responded, configuring: " + ip_list[i]);
                }
                else{
                    if (first){
                        first = false;
                        console.log("No response from: " + "192.168.1.108");
                    }
                }
                break;
            case 10:
                try{
                    await dahua_initializer({"screenshots" : false, "path": '', "headless" : true}, camera_config);
                    state = 30;
                }
                catch (e) {
                    console.log(e);
                    state = 20;
                }
                break;
            case 20:
                let input = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                console.log("There was an error with the initialization: Either the camera is configured or the program has experienced an internal error. Still want to set IP to " + ip_list['ip'][i] + "? (Y/N)");
                let answer = 'N';
                for await (const line of input){
                    answer = line;
                    input.close();
                }
                if (answer === 'Y'){
                    state = 30;
                }
                else{
                    state = 0;
                    ++i;
                }
                break;
            case 30:
                console.log("Setting IP:")
                await cam.set_ip(ip_list[i]).then(resp => console.log(resp));
                console.log("Setting FPS");
                await cam.set_fps(10).then(resp => console.log(resp));
                state = 40;
                break;
            case 40:
                let new_cam = new dahua(ip_list[i], 80, "admin", "admin1234");
                if (await new_cam.test_connection()){
                    ++i;
                    state = 0;
                    console.log("NEXT");
                }
                else {
                    console.log("Cannot reach " + ip_list[i]);
                }
                break;
        }


    }
    await dahua_initializer({"screenshots" :false, "headless": true}, camera_config);

}


main();
