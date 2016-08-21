//Headers
var SerialPort = require('serialport');
//MethodAnnouncements
var method = Sensor.prototype;
//Objects
var ObjSerialPort;
//Variables
var version = 0;
var timeStamp = 0;
var sensorData = {};

module.exports = Sensor;
//Constructor
function Sensor(port, baudrate) {
    SerialOperations(port, baudrate);
}
//Methods
method.getSensorData = function () {
    return {
        "sensorData": sensorData,
        "version": version,
        "timeStamp": timeStamp
    }
}
///Serial Operations
function SerialOperations(port, baudrate) {
    //Object Declaration
    ObjSerialPort = new SerialPort(port, {
        baudRate: baudrate,
        parser: SerialPort.parsers.readline("\n")
    });
    //Events
    ObjSerialPort.on('open', function () {
        console.log('Port open');
        setInterval(function () { ObjSerialPort.write("A"); }, 3000);
    });

    ObjSerialPort.on('data', function (data) {
        sensorData = data;
        timeStamp = Math.floor(Date.now() / 1000);
        version++;
    });
}