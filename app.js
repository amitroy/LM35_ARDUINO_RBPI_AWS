//Headers
var AWSIOT = require('aws-iot-device-sdk');
var Sensor = require('./sensor.js');
var Config = require('./cmdConfig.json').application;
//MethodAnnouncement
var method = App.prototype;
//Objects
var ObjSensor = new Sensor(Config.serialPort, Config.baudRate);
var ObjTs = new AWSIOT.thingShadow(
    {
        keyPath: Config.aws.keyPath,
        certPath: Config.aws.certPath,
        caPath: Config.aws.caPath,
        clientId: Config.aws.clientId,
        region: Config.aws.region,
        host: Config.aws.host
    }
)
//Variables
var deviceName = Config.deviceName;
var operationTimeout = Config.operationTimeout;
var thingName = Config.aws.deviceName;
var clientToken;
var expectedClientToken;
var stack = [];
var currentSensorDataVersion = 0;
var newSensorDataVersion = 0;
var toCloudSensorData = {};
var stateHolder = {};
//Constructor
function App() { }

//Registers device with AWS thingsshadow
function RegisterDevice() {
    console.log('register device');
    ObjTs.register(thingName, {
        ignoreDeltas: true,
        operationTimeout: operationTimeout
    });
}
//Filters and set data upon 'toCloudSensorData'
function FilterSetData() {
    var tempSensorDataHolder = ObjSensor.getSensorData();
    newSensorDataVersion = tempSensorDataHolder.version;
    //checks the sensor data version
    if (currentSensorDataVersion == 0 || currentSensorDataVersion < newSensorDataVersion) 
    {
        toCloudSensorData = 
        {
            celsius: JSON.parse(tempSensorDataHolder.sensorData).read.celsius,
            fahrenheit: JSON.parse(tempSensorDataHolder.sensorData).read.fahrenheit
        }
    }
    console.log(toCloudSensorData);
    stateHolder = {
        state:
        {
            reported: toCloudSensorData
        }
    }
}

//Updates AWS iot things shadow
function SendtoCloud(){
    clientToken = ObjTs.update(thingName, stateHolder);
    stack.push(clientToken);
}

//Events
ObjTs.on('connect', function () {
    console.log('connected to AWS IoT');
    RegisterDevice();
    setInterval(function () { FilterSetData(); SendtoCloud();}, 10000);
});

ObjTs.on('status', function (thingName, stat, clientToken, stateObject) {
    console.log('received ' + stat + ' on ' + thingName + ': ' + JSON.stringify(stateObject));
    //handleStatus(thingName, stat, clientToken, stateObject);
});