const axios = require('axios');
let __apiKey = null;

async function setApiKey(apiKey) {
    __apiKey = apiKey;

    getDevices(true)
        .then(function(result) {
            if (!result.data.data.devices.length > 0) {
                __apiKey = null;
                console.error('------------------------------------------------');
                console.error('          --> API-Key not working! <--          ');
                console.error(' ');
                console.error('> Status:', 'NO_DEVICES_FOUND');
                console.error('> Reason:', 'No devices found. Please check your API-Key!');
                console.error(' ');
                console.error('------------------------------------------------');
            }
        })
        .catch(function(error) {
            __apiKey = null;
            console.error('------------------------------------------------');
            console.error('          --> API-Key not working! <--          ');
            console.error(' ');
            console.error('> Status:', error.code);
            console.error('> Reason:', error.reason);
            console.error(' ');
            console.error('------------------------------------------------');
        });
}

async function sendGoveePutRequest(endpoint, body) {
    const url = `https://developer-api.govee.com/v1/devices/${endpoint}`;

    const options = {
        method: 'PUT',
        url: url,
        headers: {
            'Govee-API-Key': __apiKey,
            'Content-Type': 'application/json'
        },
        data: body
    };

    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}


async function getDevices(request) {
    if (!__apiKey) {
        throw new Error('API-Key not set');
    }

    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: 'https://developer-api.govee.com/v1/devices',
            headers: {
                'Govee-API-Key': __apiKey
            }
        };

        axios(options)
            .then(function(response) {
                if (request) {
                    resolve({
                        reason: 'Success',
                        code: 200,
                        data: response.data
                    });
                } else {
                    resolve(response.data.data.devices);
                }
            })
            .catch(function(error) {
                reject({
                    reason: error.message,
                    code: error.code,
                });
            });
    });
}

async function getDevice(device) {
    if (!__apiKey) {
        console.log('API-Key not set');
        return;
    }

    const devices = await getDevices(false);
    const deviceExists = devices.find(d => d.device === device);
    if (!deviceExists) {
        throw new Error('Device not found');
    }

    const deviceId = device;
    const deviceModel = deviceExists.model;

    return {
        setTurn: async function(bool) {
            const endpoint = 'control';
            let value = 'off';

            if (bool) value = 'on';

            const deviceSupportsTurn = deviceExists.supportCmds.find(s => s === 'turn');
            if (!deviceSupportsTurn) {
                throw new Error('Device does not support turn command');
            }

            const body = {
                device: deviceId,
                model: deviceModel,
                cmd: {
                    name: 'turn',
                    value: value
                }
            };

            try {
                const response = await sendGoveePutRequest(endpoint, body);
            } catch (error) {
                console.error('Fehler beim Einschalten:', error);
            }
        },
        setBrightness: async function(value) {
            const endpoint = 'control';

            if (value < 0 || value > 100) {
                throw new Error('Value must be between 0 and 100');
            }

            if (typeof value !== 'number') {
                throw new Error('Value must be a number');
            }

            const deviceSupportsBrightness = deviceExists.supportCmds.find(s => s === 'brightness');
            if (!deviceSupportsBrightness) {
                throw new Error('Device does not support brightness command');
            }

            const body = {
                device: deviceId,
                model: deviceModel,
                cmd: {
                    name: 'brightness',
                    value: value
                }
            };

            try {
                const response = await sendGoveePutRequest(endpoint, body);
            } catch (error) {
                console.error('Fehler beim Einschalten:', error);
            }
        },
        setColor: async function(r, g, b) {
            const endpoint = 'control';

            const color = {
                r: r,
                g: g,
                b: b
            };

            if (color.r < 0 || color.r > 255) {
                throw new Error('Value must be between 0 and 255');
            }
            if (color.g < 0 || color.g > 255) {
                throw new Error('Value must be between 0 and 255');
            }
            if (color.b < 0 || color.b > 255) {
                throw new Error('Value must be between 0 and 255');
            }

            const deviceSupportsColor = deviceExists.supportCmds.find(s => s === 'color');
            if (!deviceSupportsColor) {
                throw new Error('Device does not support color command');
            }

            const body = {
                device: deviceId,
                model: deviceModel,
                cmd: {
                    name: 'color',
                    value: {
                        r: color.r,
                        g: color.g,
                        b: color.b
                    }
                }
            };

            try {
                const response = await sendGoveePutRequest(endpoint, body);
            } catch (error) {
                console.error('Fehler beim Einschalten:', error);
            }
        },
        setColorTem: async function(value) {
            const endpoint = 'control';
            const device = deviceExists.device;

            const deviceSupportsTemperature = deviceExists.supportCmds.find(s => s === 'colorTem');
            if (!deviceSupportsTemperature) {
                console.error('Device does not support colorTem command');
                return;
            }

            const minTemperature = deviceExists.properties.colorTem.range.min || 2000;
            const maxTemperature = deviceExists.properties.colorTem.range.max || 9000;

            if (value < minTemperature || value > maxTemperature) {
                console.error('Value must be between ' + minTemperature + ' and ' + maxTemperature);
                return;
            }

            if (typeof value !== 'number') {
                console.error('Value must be a number');
                return;
            }

            const body = {
                device: deviceId,
                model: deviceModel,
                cmd: {
                    name: 'colorTem',
                    value: value
                }
            };

            try {
                const response = await sendGoveePutRequest(endpoint, body);
            } catch (error) {
                console.error('Fehler beim Einschalten:', error);
            }
        },
        sendCommand: async function(command, value) {
            const endpoint = 'control';
            const device = deviceExists.device;
            const model = deviceExists.model;

            const body = {
                device: deviceId,
                model: deviceModel,
                cmd: {
                    name: command,
                    value: value
                }
            };

            try {
                const response = await sendGoveePutRequest(endpoint, body);
            } catch (error) {
                console.error('Fehler beim Einschalten:', error);
            }
        }
    }
}

function isApiKeySet() {
    if (!__apiKey) {
        return false;
    }
    return true;
}

module.exports = {
    setApiKey,
    isApiKeySet,
    getDevices,
    getDevice
}