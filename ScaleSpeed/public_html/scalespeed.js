function deleteRow(t)
{
    var r;
    var row = t.parentNode.parentNode;
    
    var warningStatus = document.getElementById("warningsControl").getAttribute("onclick");
    if (warningStatus === "warningsOff();")
        {            
            r = confirm("You have selected a row to delete. Selecting 'OK' will delete the row.");            
        }
        
    if (r === true || warningStatus === "warningsOn();")
    {
        document.getElementById("tableResults").deleteRow(row.rowIndex);
        if (document.getElementById('tableResults').tBodies[0].rows.length === 0)
        {
            resetAvTotals();
        }
        else
        {
            calculateAverages();
        }
    }
}

function resetAvTotals()
{
    var avTime = document.getElementById("avTime");
    avTime.innerHTML = "0";
    var avSpeed = document.getElementById("avSpeed");
    avSpeed.innerHTML = "0";
}

function clearTable()
{
    if (document.getElementById('tableResults').tBodies[0].rows.length !== 0)
    {
        var r;
        var warningStatus = document.getElementById("warningsControl").getAttribute("onclick");
        if (warningStatus === "warningsOff();")
        {
            r = confirm("You have selected to clear the table of results. Selecting 'OK' will delete all results.");
        }
        if (r === true || warningStatus === "warningsOn();")
        {
            var tableResults = document.getElementById("tableResults").getElementsByTagName('tbody')[0];
            tableResults.innerHTML = "";
            resetAvTotals();
        }
    }
}

function clearData()
{
    var stopped;
    var duration;
    var actSpeed;
    var speedKm;
    var final;
    var mph;
    
    stopped = document.getElementById("stopped");
    stopped.innerHTML = "0";
    
    duration = document.getElementById("duration");
    duration.innerHTML = "0";
    
    actSpeed = document.getElementById("actSpeed");
    actSpeed.innerHTML = "0";
    
    speedKm = document.getElementById("speedKm");
    speedKm.innerHTML = "0";
    
    final = document.getElementById("final");
    final.innerHTML = "0";
    
    mph = document.getElementById("mph");
    mph.innerHTML = "0";
    
    basicMph = document.getElementById("basicMph");
    basicMph.innerHTML = "0";     
}

function calculateAverages()
{
    var numRows = document.getElementById('tableResults').tBodies[0].rows.length;
    var averageTimeTotal = 0;
    var averageSpeedTotal = 0;
    var cellTime = 0;
    var cellSpeed = 0;
    
    for (var i = 0; i < numRows; i ++)
    {
        cellTime = parseFloat(document.getElementById('tableResults').tBodies[0].rows[i].cells[0].innerHTML);
        averageTimeTotal = averageTimeTotal + cellTime;
        cellSpeed = parseFloat(document.getElementById('tableResults').tBodies[0].rows[i].cells[1].innerHTML);
        averageSpeedTotal = averageSpeedTotal + cellSpeed;
    }
    
    var avTime = document.getElementById("avTime");
    averageTimeTotal = averageTimeTotal / numRows;
    avTime.innerHTML = averageTimeTotal.toFixed(2);
    
    var avSpeed = document.getElementById("avSpeed");
    averageSpeedTotal = averageSpeedTotal / numRows;
    avSpeed.innerHTML = averageSpeedTotal.toFixed(2);    
}

function warningsOff() {
    var response = confirm("You have selected to turn off warnings. Selecting 'OK' will mean no warnings will show when you click or tap on a delete button.");
    if (response === true)
        {
            var warningsControl = document.getElementById("warningsControl");
            warningsControl.setAttribute("value", "Turn warnings back on");
            warningsControl.setAttribute("onClick", "warningsOn();");
            var warningsNote = document.getElementById("warningsNote");
            warningsNote.innerHTML = "Warnings are off. Data will be deleted without a popup warning.(Not recommened for touch screens unless care is taken)";            
        }
}

function warningsOn() {
    var response = confirm("You have selected to turn on warnings. Selecting 'OK' will means warnings will show when you click or tap on a button to delete data.");
    if (response === true)
        {
            var warningsControl = document.getElementById("warningsControl");
            warningsControl.setAttribute("value", "Turn warnings off");
            warningsControl.setAttribute("onClick", "warningsOff();");
            var warningsNote = document.getElementById("warningsNote");
            warningsNote.innerHTML = "You are set to get a warning before any data is deleted. (Especially useful for touch screens)";            
        }
}

function startTime()
{
    var start = new Date().getTime();
    var started = document.getElementById("started");
    started.innerHTML = start;
    
    var control = document.getElementById("control");
    control.value = "Stop";
    control.setAttribute("onClick", "javascript: stopTime();");
    
    var cancelControl = document.getElementById("cancelControl");
    cancelControl.setAttribute("onClick", "javascript: cancelPass();");
    
    var existingData = document.getElementById("stopped").innerHTML;
    if (!(existingData === "0"))
        {            
            clearData();
        }
}

function cancelPass ()
{
    var started;
    started = document.getElementById("started");
    started.innerHTML = "0";
    
    var control = document.getElementById("control");
    control.value = "Start";
    control.setAttribute("onClick", "javascript: startTime();");
}

function stopTime()
{
    var durationSecs = 0;
    var start = 0;
    var durationTime = 0;
    
    var stop = new Date().getTime();
    var stopped = document.getElementById("stopped");
    stopped.innerHTML = stop;
    
    var control = document.getElementById("control");
    control.value = "Start";
    control.setAttribute("onClick", "javascript: startTime();");
    
    var cancelControl = document.getElementById("cancelControl");
    cancelControl.setAttribute("onClick", "");
    
    start = document.getElementById("started").innerHTML;
    durationTime = stop - start;
    var duration = document.getElementById("duration");
    durationSecs = durationTime / 1000;
    duration.innerHTML = durationSecs;
     
    var speed = 0;
    var actualSpeed = 0;
    var distance = 0;
    var scale = 0;
    var finalSpeed = 0;
    var finalMph = 0;
    
    distance = document.getElementById("distance").value;
    actualSpeed = distance / durationSecs;
    var actSpeed = document.getElementById("actSpeed");
    actualSpeed = actualSpeed*100/100;
    actSpeed.innerHTML = actualSpeed.toFixed(2);
    scale = document.getElementById("scale").value;
    speed = (distance / 1000000) / (durationSecs / 3600);
    speed = speed*100/100;
    var speedKm = document.getElementById("speedKm");
    speedKm.innerHTML = speed.toFixed(2);
    finalSpeed = speed * scale;
    finalMph = finalSpeed * 0.621371;
    finalMph = finalMph*100/100;
    finalSpeed = finalSpeed*100/100;
    var final = document.getElementById("final");
    final.innerHTML = finalSpeed.toFixed(2);
    var mph = document.getElementById("mph");
    mph.innerHTML = finalMph.toFixed(2);
    var basicMph = document.getElementById("basicMph");
    basicMph.innerHTML = finalMph.toFixed(2);
    var tableResults = document.getElementById("tableResults");
    
    var tableResults = document.getElementById("tableResults").getElementsByTagName('tbody')[0];
    var row = tableResults.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = durationSecs.toFixed(2);
    cell2.innerHTML = finalMph.toFixed(2);
    cell3.innerHTML = '<input type="button" name="deleteRow" id="deleteRow" class="controlButton" value="Delete this result" onclick="deleteRow(this);">';  
    
    calculateAverages();
}

function lessDetail() {
    var lessDetailDiv = document.getElementById("detailedRunInfo").style.display = "none";
    var moreDetailDiv = document.getElementById("basicRunInfo").style.display="block";
    
}

function moreDetail() {
    var lessDetailDiv = document.getElementById("detailedRunInfo").style.display = "block";
    var moreDetailDiv = document.getElementById("basicRunInfo").style.display="none";
    
}