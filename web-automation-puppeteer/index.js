const puppeteer = require('puppeteer');
async function dahua_initializer(option = {"screenshots" : false, "path": '', "headless" : true}, camera_config = {"ip": "192.168.1.108", "port": 80, "screens": []}){
    const browser = await puppeteer.launch({headless: option["headless"]});
    try{
        const page = await browser.newPage();
        await page.goto("http://" + camera_config["ip"] + ":" + camera_config['port']);
        for(let i = 0; i < camera_config['screens'].length; ++i){
            for (let j = 0; j < camera_config['screens'][i].length; ++j){
                if(j === camera_config['screens'][i].length - 1 && option['screenshots']){
                    await page.screenshot({path: option['path'] + "/screen_" + i});
                }
                let action = camera_config['screens'][i][j];
                await action_onpage(page, action);
            }
        }
        await page.close();
    }
    catch (e) {
        throw e;
    }
    finally {
        await browser.close();
    }

}

async function action_onpage(page, action){
    if (action.hasOwnProperty('selector'))await page.waitForSelector(action['selector'], {visible: true});
    switch (action['action']) {
        case 'click':
            await page.click(action['selector']);
            break;
        case 'fill':
            await page.keyboard.type(action['text']);
            break;
        case 'keypress':
            await page.keyboard.press(action['key']);
            break;
        case 'delay':
            await page.waitFor(action['time']);
            break;
        default:
            throw new Error("Invalid action: " + action['action']);
    }
}

module.exports = dahua_initializer;