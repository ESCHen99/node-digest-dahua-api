const digestFetch = require('digest-fetch')
const isReacheable = require('is-reachable');
const fs = require('fs');


const client = new digestFetch('admin', 'admin1234');
const options = {};

let rawData = fs.readFileSync('ip.json').toString();
let ip = JSON.parse(rawData);
ip = ip['ip'];

(async ()=>{
while(ip.length > 0){
    for (let i = 0; i < ip.length; ++i) {
        //console.log("192.168.1." + ip[i])
        if (await isReacheable("192.168.1." + ip[i] + ':80', {timeout: 50})) {
            console.log(ip[i]);
            ip.slice(i, 1);
            let ip_addr = "192.168.1." + ip[i];
            const setNewFPS_url = `http://${ip_addr}/cgi-bin/configManager.cgi?action=setConfig&Encode[0].ExtraFormat[0].Video.FPS=10`;
            await client.fetch(setNewFPS_url, options).then(resp => resp.text()).then(data => data.trim() != 'OK' ? console.log("WTFFFFFFFFFF? " + data) : console.log(data)).catch(e => console.error(e));
        }
        else{
           // console.log("No response from " + ip[i] )
        }
    }
}
})()