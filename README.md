
![Logo](https://seeklogo.com/images/G/govee-logo-0679C21EC9-seeklogo.com.png)


# GoveeAPI: Unofficial Node API
This API allows you to interact with Govee products using the NodeJS language. It is a simple project that theoretically anyone could create with minimal experience in this field. However, I am sharing it because I had fun with it for just 30 minutes and I want to share that enjoyment. With this API, you can create things like Twitch alerts or give your friends access to control these products via Discord using a bot.


PS: There is also a paid service that will charge you for webhooks and drain your wallet. With this API, you can create an unlimited number of your own webhooks and potentially use them as a bridge to Discord or similar platforms if you're not experienced in that area. However, please refrain from spending money on such services.

I will NOT upload this project to NPM, only here on GitHub.
## Acknowledgements & Links
+ [Govee](govee.com)
+ [Govee Developer API](https://govee-public.s3.amazonaws.com/developer-docs/GoveeDeveloperAPIReference.pdf)

## Author(s) & Contributor(s)
(A) [@NiclqsGER](https://github.com/NiclqsGER)

## Dependencies
This project relies on the following dependency:

+ Axios: ^0.0.1
```npm
npm install axios
```
Make sure to include this dependency in your project before using the API.

## Example
This is a very simple use case example for this mini API.

```js
const GoveeAPI = require('./govee-api');

GoveeAPI.setApiKey('<API-KEY-HERE>');

async function main() {
    // Get all devices
    const devices = await GoveeAPI.getDevices();
    // select one by ."device"-id
    const device1 = await GoveeAPI.getDevice(devices[0].device);

    // .setTurn(true or false)
    await device1.setTurn(true);
    // .setColor(r, g, b)
    await device1.setColor(255, 0, 0);
    // .setBrightness(0-100)
    await device1.setBrightness(50);
    // .setColorTem(min->max)
    // In my case: 2000->9000
    await device1.setColorTem(3000);
    // .sendCommand(action, value) (Custom stuff)
    await device1.sendCommand('turn', 'on');
}

main();
```
