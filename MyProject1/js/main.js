//window.onload = function() {
//    // TODO:: Do your initialization job
//
//    // add eventListener for tizenhwkey
//    document.addEventListener('tizenhwkey', function(e) {
//        if (e.keyName === "back") {
//            try {
//                tizen.application.getCurrentApplication().exit();
//            } catch (ignore) {}
//        }
//    });
//
//    // Sample code
//    var mainPage = document.querySelector('#main');
//
//    mainPage.addEventListener("click", function() {
//        var contentText = document.querySelector('#content-text');
//
//        contentText.innerHTML = (contentText.innerHTML === "Basic") ? "Tizen" : "Basic";
//    });
//};

var accelerCapability = tizen.systeminfo.getCapability ('http://tizen.org/feature/sensor.accelerometer');
//var accelerMaxBatchCount;

//function onsuccessCB(hardwareInfo)
//{
//	accelerMaxBatchCount = hardwareInfo.maxBatchCount;
//}
//accelerCapability.getSensorHardwareInfo(onsuccessCB);



if (accelerCapability === true) {
    //var accelerSensor = tizen.sensorservice.getDefaultSensor ('ACCELERATOR');
    //alert("DONE!");
}

var accelerationSensor = tizen.sensorservice.getDefaultSensor("ACCELERATION");

function onGetSuccessCB(sensorData)
{
    console.log("######## Get acceleration sensor data ########");
    console.log("x: " + sensorData.x);
    //document.write("x: "+ String(sensorData.x));
    console.log("y: " + sensorData.y);
    //document.write("y: "+ String(sensorData.y)+"\n");
    console.log("z: " + sensorData.z);
    //document.write("z: "+ String(sensorData.z)+"\n");
}

function onerrorCB(error)
{
    console.log("error occurred: " + error.message);
}

function onsuccessCB()
{
    console.log("acceleration sensor start");
    accelerationSensor.getAccelerationSensorData(onGetSuccessCB, onerrorCB);
}

function onchangedCB(sensorData) {
    console.log('sensor data: ' + sensorData.x);
    console.log('sensor data: ' + sensorData.y);
    console.log('sensor data: ' + sensorData.z);
    //document.write("data: "+String(sensorData.x));
    window.onload = function(){
    	var a = document.getElementsByTagName('span')[0];
        a.innerHTML = String(sensorData.x);
        a.innerHTML = String(sensorData.y);
        a.innerHTML = String(sensorData.z);
    }
    
}
//console.log(accelerMaxBatchCount);
accelerationSensor.setChangeListener(onchangedCB, 10);
alert("done");
accelerationSensor.start(onsuccessCB);

