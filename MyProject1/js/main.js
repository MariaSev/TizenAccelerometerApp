var Start = 0;
var previos = 0; // flag means Internet acces during previous measuring  

var accelerCapability = tizen.systeminfo.getCapability ('http://tizen.org/feature/sensor.accelerometer');

if (accelerCapability === true) { var accelerationSensor = tizen.sensorservice.getDefaultSensor("ACCELERATION"); } 
else { alert("NO ACCELEROMETER!"); }

function SendData(body) {
	var req = new XMLHttpRequest();
	
	req.open('POST', 'http://localhost:2000/post');
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
	req.onreadystatechange = function() {
		if(req.readyState === 4) {
			if(req.state === 200) {
				console.log(req.responceText);
			}
		}
	};
	req.send(body);
}

function onSuccess()
{
    console.log("######## Starting get acceleration sensor data ########");
    accelerationSensor.setChangeListener(onchanged, 10);
}

function onerror(error)
{
    console.log("error occurred: " + error.message);
}

function connected()
{
    console.log("acceleration sensor connected");
    accelerationSensor.getAccelerationSensorData(onSuccess, onerror);
}

function onchanged(sensorData)
{
    console.log('sensor data: ' + sensorData.x);
    console.log('sensor data: ' + sensorData.y);
    console.log('sensor data: ' + sensorData.z);
    
    var data = { 'time': Date(), 'x': sensorData.x, 'y': sensorData.y, 'z': sensorData.z };

    if(navigator.onLine && !previous) { // clean database
    	sendFromDB();
    }
    if(navigator.onLine) {
    	console.log('internet connection');  	
    	var body = 'time=' + encodeURIComponent(data.time)+'&x='+encodeURIComponent(data.x)+'&y='+encodeURIComponent(data.y)+'&z='+encodeURIComponent(data.z);
    	SendData(body);
    	previous = 1;
    }
    else {
    	writeAccData(data);
    	previous = 0;
    }    
    document.getElementById('accel_x').innerHTML = '<p> x:'+ sensorData.x+'</p>';
    document.getElementById('accel_y').innerHTML = '<p> y:'+ sensorData.y+'</p>';
    document.getElementById('accel_z').innerHTML = '<p> z:'+ sensorData.z+'</p>';
    
    window.onload = function(){
    	var a = document.getElementsByTagName('span')[0];
        a.innerHTML = String(sensorData.x);
        a.innerHTML = String(sensorData.y);
        a.innerHTML = String(sensorData.z);
    };   
}

function Work()
{
	if(Start === 0) {
		Start = 1;
		document.getElementById('strt').innerHTML = '<span>Stop read accelerometer data</span>';
		document.getElementById('acceler_data').innerHTML = '<p> </p>';
		accelerationSensor.start(connected);
	}
	else {
		Start = 0;
		document.getElementById('strt').innerHTML = '<span>Start read accelerometer data</span>';
		accelerationSensor.stop();
		document.getElementById('acceler_data').innerHTML = '<p> Click the bottom to start read accelerometer data</p>';
	}
}

window.onload = function(){
	document.getElementById('strt').onclick = Work;
};

function connectDB(f){
	var request = indexedDB.open('AccelerometerBase', 1);
	request.onerror = function(err){ console.log(err); };
	
	request.onsuccess = function(){ f(request.result); };
	
	request.onupgradeneeded = function(e){
		e.currentTarget.result.createObjectStore('AccelerometerStore', { keyPath: "time" });
		connectDB(f);
	};
}

function writeAccData(data){
	connectDB(function(db){
	    console.log(data.time);
		var request = db.transaction('AccelerometerStore', "readwrite").objectStore('AccelerometerStore').add(data);
		
		request.onerror = function(err){ console.log(err); };
		
		request.onsuccess = function(){
			console.log("~~request.onsuccess",request.result);
			var request2 = db.transaction('AccelerometerStore', "readonly").objectStore('AccelerometerStore').get(data.time);
			request2.onsuccess = function(){ console.log(request.result); };
		};
	});
}

function printData(){
	connectDB(function(db){
		var objectStore = db.transaction("AccelerometerStore").objectStore("AccelerometerStore");

		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
			  console.log(">>>");
			  console.log(cursor.key);
			  console.log(cursor.value.x);
			  console.log(cursor.value.y);
			  console.log(cursor.value.z);
		    cursor.continue();
		  }
		  else {
		    alert("No more entries!");
		  }
			
		};
	});
}

function sendFromDB(){
	connectDB(function(db){
		var objectStore = db.transaction("AccelerometerStore").objectStore("AccelerometerStore");
		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
			  var data = {'time':cursor.key, 'x':cursor.value.x, 'y':cursor.value.y, 'z':cursor.value.z};
			  SendData(body);
			  objectStore.delete(cursor.key);
		      cursor.continue();
		  }	
	   }
   });
}





