const GoveeAPI = require('./govee-api');

GoveeAPI.setApiKey('<API-KEY-HERE>');

async function main() {
    const devices = await GoveeAPI.getDevices();
    const device1 = await GoveeAPI.getDevice(devices[0].device);

    await device1.setTurn(true);
    // await device1.setColor(255, 0, 0);
    // await device1.setBrightness(50);
    // await device1.setColorTem(3000);
    // await device1.sendCommand('turn', 'on');
}

main();