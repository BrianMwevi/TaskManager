var formTokenValue = document.getElementsByName('csrfmiddlewaretoken')[0].value;
var requestSent = false;

var waiting = 0;
var inprogress = 0;
var completed = 0;

var hrDel = 0;
var minDel = 0;
var secDel = 0;

// Fetching all the tasks when the document is ready
$(document).ready(function(){
    fetchTasks();
    myTime()
})

var time;

function myTime() {
    

    // mins = Ticking(mins);
    // secs = Ticking(secs);
    var dt = new Date();

    var hours = dt.getHours();
    var mins = dt.getMinutes();
    var secs = dt.getSeconds();
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (mins < 10) {
        mins = "0" + mins;
    }
    if (secs < 10) {
        secs = "0" + secs
    }

    autoDelete(hours, mins, secs)
    time = hours + ":" + mins + ":" + secs
    $("#liveTime").html(time)
    setTimeout(myTime, 1000)
}

// Task summary
function taskSummary() {
    var totalTasks = waiting + inprogress + completed;
    var workedHours = sucessRate * 0.08
    workedHours = Math.round((workedHours + 0.00001) * 100) / 100
    var sucessRate = (completed/totalTasks) * 100 + ((inprogress/totalTasks) * 100)/2;
    sucessRate = Math.round((sucessRate + 0.00001) * 100) / 100
    

    $("#numWaiting").text(waiting);
    $("#numProgress").text(inprogress);
    $("#numCompleted").text(completed);
    $("#numTasks").text(totalTasks);
    $("#numHours").text(workedHours);
    $("#numSuccess").text(sucessRate + "%");
    
    if (isNaN(workedHours)) {
        $("#numHours").text("0")
    }
    if (isNaN(sucessRate)) {
        $("#numSuccess").text("0%");
    }
    

    if (totalTasks === 0) {
        $("#notifications").removeClass("fa-bell");
        $("#notifications").addClass("fa-bell-slash");
    } else {
        $("#notifications").removeClass("fa-bell-slash");
        $("#notifications").addClass("fa-bell");
    }
    
    emptyMax()
}

// If no task(s)
function emptyMax() {
    if (waiting == 0) {
        $("#waitingTasks").html("<h4 id='noNew' class='gradient text-center py-5'>No new Tasks!</h4>")
    }

    else {
        $("#waitingTasks #noNew").remove()
        if (waiting >= 7) {
            $("#addTask, #navTask").removeAttr("onclick")
            $("#addTask").removeClass("new")
        }
        else {
            $("#addTask").addClass("new")
            $("#addTask, #navTask").attr("onclick", "newTask()")
        }
    }
    if (inprogress == 0) {
        $("#inprogressTasks").html("<h4 id='noProgress' class='gradient text-center py-5'>No tasks inprogress!</h4>")
    } else {
        $("#inprogressTasks #noProgress").remove()
    }
    if (completed == 0) {
        $("#completedTasks").html("<h4 id='noCompleted' class='gradient text-center py-5'>No completed Tasks!</h4>")
    } else {
        $("#completedTasks #noCompleted").remove()
    }
}

function parseTasks(data){
    $.each(data, function(key, value){
        loopTasks(value)

    })
}

function loopTasks(cat, updated, dropped){

    var taskId = cat.id;
    var title = cat.title;
    var content = cat.content;
    var taskCat = cat.category;
    var createdDate = cat.created_date;
    var endDate = cat.end_date;
    var tasksDisplay = "<form method='POST' class='gradient collapse' id='form" + taskId + "'" + "><input type='hidden' name='category' value='" + taskCat + "' id='cat" + taskId +"'" +
                        "><input type='hidden'  name='csrfmiddlewaretoken' value='" + formTokenValue + "'" + " id='token" + taskId + "'" + "><div></div><div class='form-group'>\
                        <span closeUpdate'><i class='btn fa fa-close float-right btn-dark rounded p-2' id='close" + taskId + "'" + " ></i></span><input type='text'\
                        class='form-control form_create border-0' required value='" + title+ "'" + " name='title' autofocus='' id='title" + taskId + "'" + "></div>\
                        <div class='form-group'><textarea name='content' class='form_create form-control border-0' required='' autofocus='' id='content" + taskId + "'" + ">" + content + "</textarea></div>\
                        <input type='submit' class='btn gradient' value='Update' id='submit" + taskId + "'" + "></form></div><div draggable='true' ondragstart='drag(event)'\
                        id='card" + taskId + "'" + " class='card gradient collapse task-card py-2 pl-3'><span><h5 class='d-inline py-2' id='header" + taskId + "'" + "> " + title +
                        "</h5><span class='float-right'><i class='edit btn btn-sm  fa fa-pencil' onclick='updateForm()' id='" + taskId + "'" + ">\
                        </i><i class='delete btn btn-sm fa' onclick='deleteTask()' id='delete" + taskId + "'" + "></i></span></span><small id='date" + taskId + "'>" + createdDate + "</small></div>"
    if (cat.category == 1) {
        
        if (updated) {
            $("#card" + taskId).replaceWith(tasksDisplay);
        } else if(dropped) {
            waiting += 1
            $("#waitingTasks").append(tasksDisplay);
        }else {
            waiting += 1

            $("#waitingTasks").before(tasksDisplay);
        }
        $("#delete" + taskId).addClass("fa-close")
        taskSummary()

    } else if (cat.category == 2) {

        if (updated) {
            $("#card" + taskId).replaceWith(tasksDisplay);
        } else if(dropped) {
            inprogress += 1
            $("#inprogressTasks").append(tasksDisplay);
        } else {
            inprogress += 1
            $("#inprogressTasks").append(tasksDisplay);
        }
        // document.getElementById("card" + taskId).style.opacity = ".95";
        $("#delete" + taskId).addClass("fa-close")
        $("#date" + taskId).replaceWith("<small id='date" + taskId + "'><span class='fa fa-square pr-1'></span>" + createdDate + "</small>")
        taskSummary()
    }
    else  {
        if (updated) {
           $("#card" + taskId).replaceWith(tasksDisplay);
        } else if(dropped) {
            completed += 1
            $("#completedTasks").before(tasksDisplay);
            
        } else {
            completed += 1
            $("#completedTasks").before(tasksDisplay);
        }
        $("#delete" + taskId).addClass("fa-trash")
        $("#header" + taskId).replaceWith("<h5 class='d-inline'><strike>" + title + "</strike></h5>")
        $("#date" + taskId).replaceWith("<small id='date" + taskId + "'><span class='fa fa-check-square pr-1'></span>" + endDate + "</small>")
        taskSummary()
    }
}

// Drag and drop
function allowDrop(ev) {
    ev.preventDefault();
}
var whatCat;

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    var element = ev.currentTarget.id;
    var thisId = element.substring("4")

    whatCat = $("#cat" + thisId).val()
}

// Dropped target


// On drop update the DB and delete the later
function drop(ev, el) {
    ev.preventDefault();
    var calUpdate = false;    
    var data = ev.dataTransfer.getData("text");
    var thisId = data.substring("4");
    var sendUrl = "/api/tasks/update/" + thisId + "/"    
    var targeted = (ev.currentTarget.id);

    function checkCat() {
        var cat = $("#cat" +  thisId).val();
        if (cat == whatCat) {
            calUpdate = false;  
        } else {
            calUpdate = true

            if (whatCat == 1) {
                waiting -= 1    
            } else if (whatCat == 2) {
                inprogress -= 1
            }
            else {
                completed -= 1
            }
        }
    }

    if (targeted == "waiting") {
        $("#cat" + thisId).val("1");
        checkCat()
    } else if (targeted == "inprogress") {
        $("#cat" + thisId).val("2");
        checkCat()
    } else if (targeted == "complete") {
        $("#cat" + thisId).val("3");
        checkCat();
    } else {

        calUpdate = false;
    }

    
    if (calUpdate) {
        var taskForm = document.getElementById("form"+thisId);
        var data = $(taskForm).serialize()
        $(taskForm).remove()
        $("#card" + thisId).remove()
       
        updateTask(data, sendUrl, thisId, true)

    } else {

        console.log("Dropped in the same category!")
    }
    
}

// Getting the tasks from the database
function fetchTasks(){

    $.ajax({
        url : "/api/tasks/",
        method : "GET",
        data : "data",
        success : function(data){
            parseTasks(data)
            taskSummary()
            
            var filter = ($("#waitingTasks").find())
            // console.log(filter)



        },
        errors : function(data){
            alert("Errors")
        },
    });
}

// Creating New Tasks
function newTask() {
    $("#createForm").toggle(250);
    $("#noNew").toggle(250)
}


function createForm(){
    var form = $("#createForm");

    form.submit(function(){ 
        if (!requestSent) {
            requestSent = true;

            event.preventDefault();
            var thisData = $(this);
            var formData = thisData.serialize();

            $.ajax({
                url     : "/api/tasks/create/",
                method  : "POST",
                data    : formData,
                success : function(data){
                    $("#createForm").toggle(250);
                    document.getElementById("createForm").reset()
                    loopTasks(data)
                    
                    requestSent = false;
                },
                errors  : function(data){
                    alert("Form errors")
                },
            })
        }
    });
};

// Updating existing tasks
function updateForm(){

    var thisId = event.target.id; // getting id of the task to be edited
    var formId = $("#form" + thisId);
    var cardId = $("#card" + thisId);
    var formUrl = "/api/tasks/update/" + thisId + "/"

    // Hide task and show form
    $(formId).show(200, function(){
        $(cardId).slideUp(100);
    })

    // Hide form and show task
    $("#close" + thisId).click(function(){
        $(formId).hide(250, function(){
            $(cardId).slideDown(100)
        })
    })

    // Submit data, hide form, hide task
    $(formId).submit(function(event){
        event.preventDefault()
        $(formId).hide(250)
        var formData = $(this).serialize()
        updateTask(formData, formUrl, thisId)
    })

}

// Ajax post call
function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// Before sending the data
 

function updateTask(formData, sendUrl, taskId, dropped){

    $.ajax({
        url : sendUrl,
        method : "PUT",
        data : formData,
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success : function(data){
            if (dropped) {
                loopTasks(data, false, dropped)
            } else {
                loopTasks(data, true, false)
                $("#card" + taskId).show(100)
            }
            
                
        },
        errors : function(data){
            alert("Errors")
        },
  })
}

function deleteTask() {
    var rawId = event.target.id;
    var thisId = rawId.substring("6")
    $("#card" + thisId).slideUp(100);
    var url = "/api/tasks/delete/" + thisId + "/"
    dbDelete(thisId, url)
    taskSummary()
    console.log("Delete initiated!")
}

// Delete the hidden element in the DB
function dbDelete(taskId, url) {
    $.ajax({
        url     : url,
        type  : "DELETE",
        data    : taskId,
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success : function (data){
            console.log(waiting, inprogress, completed)
            var cat = $("#cat" + taskId).val();
            if (cat == 1) {
                waiting -= 1
                console.log("waiting " + waiting)
            }
            if (cat == 2) {
                inprogress -= 1
                console.log("inprogress " + inprogress)
            }
            if (cat == 3) {
                completed -= 1
                console.log("completed " + completed)
            }
            taskSummary()
        },
        errors : function(data){
            console.log("Errors on delete")
        },
    })
}

function autoDelete(hours, mins, secs) {
    if (secs == 0) {

    }
    if (hours == hrDel &&  mins == minDel && secs == secDel) {
        console.log("Delete == true")
    }
    // console.log(hrDel, minDel, secDel)
}
