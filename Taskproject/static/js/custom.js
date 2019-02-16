var formTokenValue = document.getElementsByName('csrfmiddlewaretoken')[0].value;
var requestSent = false;

// Fetching all the tasks when the document is ready
$(document).ready(function(){
    fetchTasks();

   
})

function parseTasks(data){

    $.each(data, function(key, value){
        loopTasks(value)

    })
}

function loopTasks(cat, updated){

    var taskId = cat.id;
    var title = cat.title;
    var detail = cat.content;
    var taskCat = cat.category;
    var createdDate = cat.created_date;
    var tasksDisplay = "<form method='POST' class='gradient collapse' id='form" + taskId + "'" + "><input type='hidden' name='category' value='" + taskCat + "' id='cat" + taskId +"'" +
                        "><input type='hidden'  name='csrfmiddlewaretoken' value='" + formTokenValue + "'" + " id='token" + taskId + "'" + "><div></div><div class='form-group'>\
                        <span closeUpdate'><i class='btn fa fa-close float-right btn-dark rounded p-2' id='close" + taskId + "'" + " ></i></span><input type='text'\
                        class='form-control form_create border-0' required value='" + title+ "'" + " name='title' autofocus='' id='title" + taskId + "'" + "></div>\
                        <div class='form-group'><textarea name='content' class='form_create form-control border-0' required='' autofocus='' id='detail" + taskId + "'" + ">" + detail + "</textarea></div>\
                        <input type='submit' class='btn gradient' value='Update' id='submit" + taskId + "'" + "></form></div><div draggable='true' ondragstart='drag(event)' id='card" + taskId + "'" + " class='card collapse task-card gradient my-1'><div class='card-body p-2'><h5 class='d-inline'> " + title +
                        "</h5><span class='float-right'><i class='edit btn btn-sm fa fa-pencil mx-2 text-success' onclick='updateForm()' id='" + taskId + "'" + ">\
                        </i><i class='delete btn fa fa-close px-2 py-1' onclick='deleteTask()' id='delete" + taskId + "'" + "></i></span><small><br>" + createdDate + "</small></div>"
    
    if (cat.category == 1) {
        var new1 = $("#waitingTasks");

        if (updated) {
            console.log(taskId)
            $("#card" + taskId).replaceWith(tasksDisplay);
        } else {
            new1.before(tasksDisplay);
        }
        
    } else if (cat.category == 2) {
        var doing = $("#inprogressTasks");
        if (updated) {
            doing.after(tasksDisplay);
        } else {
            doing.before(tasksDisplay);
        }
    }
    else  {
        $("#completedTasks").after(tasksDisplay);
        var thisId = $("#delete" + taskId)
        $(thisId).removeClass("fa-close")
        $(thisId).addClass("fa-trash")
    }
}

// Drag and drop
function allowDrop(ev) {
    ev.preventDefault();


}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    // console.log(this)

}

// On drop update the DB and delete the later
function drop(ev, el) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    el.appendChild(document.getElementById(data));

    var thisId = data.substring("4");
    var sendUrl = "/api/tasks/update/" + thisId + "/"    
    var targeted = (ev.currentTarget.id);

    if (targeted == "waiting") {
        $("#cat" + thisId).val("1");
        // $("#waitingTasks" +  thisId).prepend(taskForm);
    } else if (targeted == "inprogress") {
        $("#cat" + thisId).val("2");
    } else {
        $("#cat" + thisId).val("3");
    }

    var taskForm = document.getElementById("form"+thisId);
    var data = $(taskForm).serialize()
    $(taskForm).remove()
    $("#card" + thisId).remove()

    updateTask(data, sendUrl, thisId)
}

// Getting the tasks from the database
function fetchTasks(){

    $.ajax({
        url : "/api/tasks/",
        method : "GET",
        data : "data",
        success : function(data){
            parseTasks(data)

        },
        errors : function(data){
            alert("Errors")
        },
    });
}

// Creating New Tasks
function newTask() {
    $("#createForm").toggle(250)
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
                    $("#createForm").toggle(250)
                    loopTasks(data)
                    $("#formToggler").addClass("collapsed");
                    document.getElementById("createForm").reset();               
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
        $(formId).hide(1000)
        var formData = $(this).serialize()
        updateTask(formData, formUrl, thisId)
        // $(cardId).show(100);
    })

}

// Ajax post call
function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function updateTask(formData, sendUrl, taskId){

    $.ajax({
        url : sendUrl,
        method : "PUT",
        data : formData,
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success : function(data){
                loopTasks(data, true)
                $("#card" + taskId).show(100)
        },
        errors : function(data){
            alert("Errors")
        },
  })
}

function deleteTask() {
    var rawId = event.target.id;
    var thisId = rawId.substring("6")
    alert(thisId)
   $("#card" + thisId).slideUp(100);
   url = "/api/tasks/delete/" + thisId + "/"
   dbDelete(thisId, url)
}

// Delete the hidden element in the DB
function dbDelete(taskId, url) {
    $.ajax({
        url     : url,
        method  : "DELETE",
        data    : "data",
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success : function (data){
            console.log("Deleted!")
        }
    })
}














