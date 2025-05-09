/*
Deletes a row from the results table 
*/
function deleteRow(deleteButton) {
    let confirmResult;
    const row = deleteButton.parentNode.parentNode;
    const warningStatus = document.getElementById("warningsControl").value;

    //presence of warningsOff() function means warnings are presently on 
    if (warningStatus === "Turn warnings off"){            
            confirmResult = confirm("You have selected a row to delete. Selecting 'OK' will delete the row.");            
        }
        
    if ( confirmResult === true || warningStatus === "Turn warnings on"){
        document.getElementById("tableResults").deleteRow(row.rowIndex);
        if (document.getElementById('tableResults').tBodies[0].rows.length === 0){
            resetAvTotals();
        } else {
            calculateAverages();
        }
    }
}

/*
Needed when the table is cleared or when a row is deleted   
*/
function resetAvTotals() {
    document.getElementById("avTime").innerHTML = "0";
    document.getElementById("avSpeed").innerHTML = "0";
}

/*
Clears the results table
*/
function clearTable() {
    if (document.getElementById('tableResults').tBodies[0].rows.length !== 0){
        let confirmResult;
        const warningStatus = document.getElementById("warningsControl").getAttribute("onclick");

        //presence of warningsOff() function means warnings are presently on
        if (warningStatus === "warningsOff();"){
            confirmResult = confirm("You have selected to clear the table of results. Selecting 'OK' will delete all results.");
        }
        if (confirmResult === true || warningStatus === "warningsOn();"){
            document.getElementById("tableResults").getElementsByTagName('tbody')[0].innerHTML = "";
            resetAvTotals();
        }
    }
}

/*
Clears the pass data after a new passed is started, or a pass is cancelled
*/
function clearData() {
    const runTable = document.getElementById("detailedRunInfo");
    const cells = runTable.getElementsByTagName("span");

    //skips start time
    for (let i = 1; i < cells.length; i++){
        cells[i].innerHTML = "0"    
    }   
}

/*
Calculates the average of all passes as each pass is recorded
*/
function calculateAverages() {
    const numRows = document.getElementById('tableResults').tBodies[0].rows.length;
    let averageTimeTotal = 0;
    let averageSpeedTotal = 0;
    
    for (let i = 0; i < numRows; i ++){
        averageTimeTotal = averageTimeTotal + parseFloat(document.getElementById('tableResults').tBodies[0].rows[i].cells[0].innerHTML);
        averageSpeedTotal = averageSpeedTotal + parseFloat(document.getElementById('tableResults').tBodies[0].rows[i].cells[1].innerHTML);
    }
    
    averageTimeTotal = averageTimeTotal / numRows;
    document.getElementById("avTime").innerHTML = averageTimeTotal.toFixed(2);
    
    averageSpeedTotal = averageSpeedTotal / numRows;
    document.getElementById("avSpeed").innerHTML = averageSpeedTotal.toFixed(2);    
}

/*
Turns off the pop up warnings when deleting recorded runs
*/
function toggleWarnings() {
    if (document.getElementById("warningsControl").value === 'Turn warnings off') {
        const response = confirm("You have selected to turn off warnings. Selecting 'OK' will mean no warnings will show when you click or tap on a delete button.");
        if (response === true)
            {
                document.getElementById("warningsControl").setAttribute("value", "Turn warnings on");
                document.getElementById("warningsNote").innerHTML = "Warnings are off. Data will be deleted without a popup warning.(Not recommended for touch screens unless care is taken)";            
            }
    } else if ((document.getElementById("warningsControl").value === 'Turn warnings on')){
        const response = confirm("You have selected to turn on warnings. Selecting 'OK' will means warnings will show when you click or tap on a button to delete data.");
        if (response === true)
            {
                document.getElementById("warningsControl").setAttribute("value", "Turn warnings off");
                document.getElementById("warningsNote").innerHTML = "You are set to get a warning before any data is deleted. (Especially useful for touch screens)";            
            }
    }
}

/*
Updates whether a pass is in the process of being run or not
*/
function runningState(state) {
    const displayedState = document.getElementById("runningState").getElementsByTagName('p')[0];

    if (state === 'started'){ 
     displayedState.innerHTML = "Running";
     displayedState.classList.add("running");
    } else if (state === 'stopped') {
        displayedState.innerHTML = "Stopped";
        displayedState.classList.remove("running");
        } else if (state === 'cancelled'){
            displayedState.innerHTML = 'Cancelled';
            displayedState.classList.remove("running");
        } else {
            displayedState.innerHTML = "Idle";
            displayedState.classList.remove("running");
        }
}

/*
Starts recording a run
*/
function startTime() {

    start = new Date();
    document.getElementById("started").innerHTML = start.toLocaleTimeString; 

    runningState('started');
    
    const control = document.getElementById("control");
    control.value = "Stop";
    control.setAttribute("onClick", "javascript: stopTime();");
    
    const cancelControl = document.getElementById("cancelControl");
    cancelControl.setAttribute("onClick", "javascript: cancelPass();");
    
    const existingData = document.getElementById("stopped").innerHTML;
    if (!(existingData === "0"))
        {            
            clearData();
        }
    return start;
}

/*
Cancels a pass without recording a result
*/
function cancelPass () {
    document.getElementById("started").innerHTML = "0";;
    
    runningState('cancelled'); 
    
    const control = document.getElementById("control");
    control.value = "Start";
    control.setAttribute("onClick", "javascript: startTime();");
}

/*
Stops a run and records the time
ToDo - This needs splitting up

functions:
-stop recording and actual speed in mm and kph
-convert to kph
-convert to mph

*/
function stopTime() {
    //Record the time
    //Set controls
    //Calculate results
    //display results
    
    let durationSecs = 0;
    let durationTime = 0;
    
    const stop = new Date();
    document.getElementById("stopped").innerHTML = stop.toLocaleTimeString;
    
    runningState('stopped');
    
    const control = document.getElementById("control");
    control.value = "Start";
    control.setAttribute("onClick", "javascript: startTime();");
    
    const cancelControl = document.getElementById("cancelControl");
    cancelControl.setAttribute("onClick", "");
    
    durationTime = stop - start.getTime();
    let duration = document.getElementById("duration");
    durationSecs = durationTime / 1000;
    duration.innerHTML = durationSecs;

    calculateResult();

}

function calculateResult() {
    let speed = 0;
    let actualSpeed = 0;
    let distance = 0;
    let scale = 0;
    let finalSpeed = 0;
    let finalMph = 0;
    
    distance = document.getElementById("distance").value;
    actualSpeed = distance / durationSecs;
    document.getElementById("actSpeed").innerHTML = actualSpeed.toFixed(2);
    scale = document.getElementById("scale").value;
    speed = (distance / 1000000) / (durationSecs / 3600);
    document.getElementById("speedKm").innerHTML = speed.toFixed(2);
    finalSpeed = speed * scale;
    finalMph = finalSpeed * 0.621371;
    document.getElementById("final").innerHTML = finalSpeed.toFixed(2);
    document.getElementById("mph").innerHTML = finalMph.toFixed(2);
    document.getElementById("basicMph") = finalMph.toFixed(2);
    
    let tableResults = document.getElementById("tableResults").getElementsByTagName('tbody')[0];
    let row = tableResults.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = durationSecs.toFixed(2);
    cell2.innerHTML = finalMph.toFixed(2);
    cell3.innerHTML = '<input type="button" name="deleteRow" id="deleteRow" class="controlButton" value="Delete this result" onclick="deleteRow(this);">';  
    
    calculateAverages();
}

/*
Displays less detail about the last completed run
*/
function lessDetail() {
    let lessDetailDiv = document.getElementById("detailedRunInfo").style.display = "none";
    let moreDetailDiv = document.getElementById("basicRunInfo").style.display="block";
    
}

/*
Displays more detail about the last completed run
*/
function moreDetail() {
    let lessDetailDiv = document.getElementById("detailedRunInfo").style.display = "block";
    let moreDetailDiv = document.getElementById("basicRunInfo").style.display="none";
    
}

