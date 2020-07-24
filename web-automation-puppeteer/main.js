const puppeteer = require('puppeteer');
const digestFetch = require('digest-fetch')
const isReacheable = require('is-reachable');
const fs = require('fs')
const readline = require('readline');


let rawData = fs.readFileSync('llista_ip.json').toString();
let ip_list = JSON.parse(rawData);
console.log(ip_list["ip"]);

const old_ip = "192.168.1.108";

async function device_init(browser, image_path){
 		const page = await browser.newPage();
 		await page.goto("http://" + old_ip);

 		await page.waitForSelector("#login_permission4", {visible: true, timeout: 10000});
 		await page.click("#nation_select");
 		await page.keyboard.type("Spain");
 		await page.keyboard.press('Enter');
 		await page.click("#init_language");
 		await page.click("#login_permission4 .u-dialog-foot a");
 		await page.waitForSelector("#login_permission1 input[type=checkbox]", {visible: true});
		await page.click("#login_permission1 input[type=checkbox]").catch(e=>console.log('e'));
		await page.waitForSelector("#login_permission1 .u-dialog-foot a", {visible: true});
		await page.screenshot({path: image_path + "/language.png"});
		await page.click("#login_permission1 .u-dialog-foot a");

		await page.waitForSelector("#devinit_time_zone", {visible: true});
		await page.waitForSelector("#devinit_time_zone #syncPCBtn", {visible: true});
		await page.click("#devinit_time_zone #syncPCBtn");
		await page.waitFor(1000); // Safewait
		await page.waitForSelector("#devinit_time_zone .u-dialog-foot a",{visible: true});
		await page.screenshot({path: image_path + "/time_zone.png"});
		await page.click("#devinit_time_zone .u-dialog-foot a");

		await page.waitForSelector("#device_init", {visible: true});
		await page.waitForSelector("#device_init input[name=newpwd]", {visible: true});
		await page.waitForSelector("#device_init input[name=newpwdcfm]", {visible: true});
		await page.waitForSelector("#device_init #devInit_mail_enable", {visible: true});
		await page.waitForSelector("#device_init .u-dialog-foot a", {visible: true});
		await page.click("#device_init input[name=newpwd]");
		await page.keyboard.type("admin1234");
		await page.click("#device_init input[name=newpwdcfm]");
		await page.keyboard.type("admin1234");
		await page.click("#device_init #devInit_mail_enable");
		await page.screenshot({path: image_path + "/dev_init.png"});
		await page.click("#device_init .u-dialog-foot a");

		await page.waitForSelector("#login_permission2", {visible: true});
		await page.waitForSelector("#login_permission2 .u-dialog-foot a",{visible: true});
		await page.screenshot({path: image_path + "/p2p.png"});
		await page.click("#login_permission2 .u-dialog-foot a");

		await page.waitFor(1000);

		await page.waitForSelector("#login_permission3", {visible: true});
		await page.waitForSelector("#login_permission3 .u-dialog-foot a",{visible: true});
		await page.screenshot({path: image_path + "/update.png"});
		await page.click("#login_permission3 .u-dialog-foot a");

		await page.waitFor(1000);

		await page.close();
}

async function set_ip(unset_ip, set_ip){
	const client = new digestFetch('admin', 'admin1234');
	const options = {};
	const setNewIpAddr_url = `http://${unset_ip}/cgi-bin/configManager.cgi?action=setConfig&Network.eth0.IPAddress=${set_ip}`;
	await client.fetch(setNewIpAddr_url, options).then(resp=>resp.text()).then(data=>console.log(data)).catch(e=>console.error(e));
}

async function set_fps(ip){
	const client = new digestFetch('admin', 'admin1234');
	const options = {};
	const setNewIpAddr_url = `http://${ip}/cgi-bin/configManager.cgi?action=setConfig&Encode[0].ExtraFormat[0].Video.FPS=10`;
	await client.fetch(setNewIpAddr_url, options).then(resp=>resp.text()).then(data=>console.log(data)).catch(e=>console.error(e));
}

async function main(){
	let state = 0;
	let i = 0;
	let first = true;
	while(i < ip_list['ip'].length){
		switch(state){
			case 0:
				if(await isReacheable(old_ip + ':80')){
					state = 1;
					try {
						first = true;
						await fs.mkdir(ip_list['ip'][i], {}, function(e){console.log(e)});
					}
					catch (e) {
						console.log(e);
					}
					console.log("Responded, configuring: " + ip_list['ip'][i]);
				}
				else{
					if (first) {
					console.log("No response from " + old_ip);
						first = false;
					}
				}
				break;
			case 1:
				const browser = await puppeteer.launch({headless: true});
				try {
					await device_init(browser, ip_list['ip'][i]);
					await browser.close();
					state = 3;
				}
				catch (e) {
					console.log("Your Device might been already configured "+ e);
					state = 2;
				}
				finally {
					await browser.close();
				}
				break;
			case 2:
				let input = readline.createInterface({
					input: process.stdin,
					output: process.stdout
				});
				console.log("Still want to set IP to " + ip_list['ip'][i] + "? (Y/N)");
				let answer = 'N';
				for await (const line of input){
					answer = line;
					input.close();
				}
				if (answer === 'Y'){
					state = 3;
				}
				else{
					state = 0;
					++i;
				}
				break;
			case 3:
				console.log("SET FPS:")
				await set_fps(old_ip);
				console.log("SET IP: " + ip_list['ip'][i])
				await set_ip(old_ip, ip_list['ip'][i]);
				state = 4;
				break;
			case 4:
				let can_connect = await isReacheable(ip['ip'][i] + ':80');
				if (can_connect){
					console.log("Configure NEXT camera");
					++i;
					state = 0;
				}
				else{
					console.log("Cannot reach" + ip_list['ip'][i]);
				}
				break;
		}

	}
}

main().catch(e=>console.log(e));


