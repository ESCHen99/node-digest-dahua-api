const digest = require('digest-fetch');
const isReachable = require('is-reachable');

class Dahua{

    constructor(ip, port = 80, user, password){
        this.ip = ip;
        this.port = port;
        this.user = user;
        this.password = password;
        this.connection = new digest(this.user, this.password);
    }

    async test_connection(){
        return await isReachable("http://" + this.ip);
    }

    async set_ip(ip){
        const options = {};
        const setNewIpAddr_url = `http://${this.ip}:${this.port}/cgi-bin/configManager.cgi?action=setConfig&Network.eth0.IPAddress=${ip}`;
        await this.connection.fetch(setNewIpAddr_url, options);
    }

    async set_fps(fps){
        const options = {};
        const setNewIpAddr_url = `http://${this.ip}:${this.port}/cgi-bin/configManager.cgi?action=setConfig&Encode[0].ExtraFormat[0].Video.FPS=${fps}`;
        await this.connection.fetch(setNewIpAddr_url, options);
    }

    async sync_time(new_date){
        let year = new_date.getFullYear();
        let month = new_date.getUTCMonth() + 1;
        let date = new_date.getUTCDate();

        let hour = new_date.getHours();
        let minute = new_date.getMinutes();
        let secon = new_date.getSeconds();

        const options = {};
        const syncTime_url = `http://${this.ip}:${this.port}/cgi-bin/global.cgi?action=setCurrentTime&time=${year}-${month}-${date}%20${hour}:${minute}:${secon}`;
        await this.connection.fetch(syncTime_url, options);
    }
}

module.exports = Dahua;