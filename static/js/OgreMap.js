function OgreSpawnPoint(x, y) {
    this.x = x;
    this.y = y;
}

var OgreSpawnPoints = [
    new OgreSpawnPoint(386, 65),
    new OgreSpawnPoint(485, 254),
    new OgreSpawnPoint(211, 326),
    new OgreSpawnPoint(429, 434),
    new OgreSpawnPoint(563, 497),
    new OgreSpawnPoint(367, 688),
    new OgreSpawnPoint(165, 613),
    new OgreSpawnPoint(129, 688),
    new OgreSpawnPoint(219, 849),
    new OgreSpawnPoint(350, 792),
];

var OgreDeadTime = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
var warningTimeBeforeRespawn = 60;
var OgreDrawColor = ["red", "gray", "yellow", "green", "blue"];

// Parameters:
//    deadTime: input dead time
// Returns:
//    0 : unknown
//    1 : dead
//    2 : might be respawn shortly after
//    3 : might be respawn
//    4 : already respawn
function CheckOgreStatus(deadTime) {
    var currentTime = Date.now();
    if (deadTime == -1) {
        return 0;
    } else {
        var delta = currentTime - deadTime;
        if (delta < 600000 - warningTimeBeforeRespawn*1000) {
            return 1;
        } else if (delta >= 600000 - warningTimeBeforeRespawn*1000 && delta < 600000) {
            return 2;
        } else if (delta >= 600000 && delta < 900000) {
            return 3;
        } else if (delta >= 900000 && delta < 1200000 - warningTimeBeforeRespawn*1000) {
            return 4;
        } else if (delta >= 1200000 - warningTimeBeforeRespawn*1000 && delta < 1200000) {
            return 2;
        } else if (delta >= 1200000) {
            return 3;
        }
    }
}

var canvas = document.getElementById("mapCanvas");
var context = canvas.getContext("2d");
var info = document.getElementById("informationContainer");

canvas.onclick = function(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    
    for (p in OgreSpawnPoints) {
        if ((OgreSpawnPoints[p].x-x)*(OgreSpawnPoints[p].x-x) + (OgreSpawnPoints[p].y-y)*(OgreSpawnPoints[p].y-y) < 900) {
            KillOgre(p);
            break;
        }
    }
}


function RefreshOgreInformation() {
    DrawOgreMap();
    SetOgreMessage();
}

function DrawOgreMap() {
    context.clearRect(0, 0, canvas.width, canvas.height);    
    context.font = "32px Arial";
    
    for (p in OgreSpawnPoints) {
        var status = CheckOgreStatus(OgreDeadTime[p]);
        context.fillStyle = OgreDrawColor[status];
        context.fillText(p, OgreSpawnPoints[p].x-9, OgreSpawnPoints[p].y+11);
        context.strokeStyle = OgreDrawColor[status];
        context.beginPath();
        context.arc(OgreSpawnPoints[p].x, OgreSpawnPoints[p].y, 30, 0, 2*Math.PI);
        context.stroke();
        
    }
}

function MsToTime(t) {
    var seconds = parseInt((t/1000)%60)
    var minutes = parseInt((t/(1000*60))%60)
    var hours = parseInt((t/(1000*60*60))%24);
    
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function SetOgreMessage() {
    var message = "";
    for (p in OgreSpawnPoints) {
        message += "Ogre #" + p.toString() + " ";
        var status = CheckOgreStatus(OgreDeadTime[p]);
        if (status == 0) {
            message += "Unknown</br>";
        } else {
            var delta = Date.now() - OgreDeadTime[p];
            message += "Dead for " +MsToTime(delta) + "</br>";
        }
    }
    info.innerHTML = message;
}

RefreshOgreInformation();
var t=setInterval(RefreshOgreInformation,1000);

function KillOgre(n) {
    OgreDeadTime[n] = Date.now();
    RefreshOgreInformation();
}

function ResetOgre() {
    for (p in OgreDeadTime) {
        OgreDeadTime[p] = -1;
    }
    RefreshOgreInformation();
}