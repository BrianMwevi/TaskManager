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

function loopTasks(cat, created, updated){
       
        var taskId = cat.id;
        var title = cat.title;
        var detail = cat.content;
        var createdDate = cat.created_date;
        var tasksDisplay = "<form method='POST' class='gradient d-none' id='form" + taskId + "'" + "><input type='hidden'  name='csrfmiddlewaretoken' value='" + formTokenValue + "'" + " id='token" + taskId + "'" + "><div></div><div class='form-group'>\
                            <span closeUpdate'><i class='btn fa fa-close float-right btn-dark rounded p-2' id='close" + taskId + "'" + " ></i></span><input type='text' class='form-control form_create border-0' required value='" + title+ "'" + " name='title' autofocus=''></div>\
                            <div class='form-group'><textarea name='content' class='form_create form-control border-0' required='' autofocus=''>" + detail + "</textarea></div>\
                            <input type='submit' class='btn gradient' value='Update' id='submit" + taskId + "'" + "></form></div><div id='card" + taskId + "'" + " class='task-card gradient card my-1'><div class='card-body p-2'><h5 class='d-inline'> " + title +
                            "</h5><span class='float-right'><i class='edit btn btn-sm fa fa-pencil mx-2 text-success' onclick='updateForm()' id='" + taskId + "'" + ">\
                            </i><i class='delete btn fa fa-close px-2 py-1' onclick='deleteTask()' id='" + taskId + "'" + "></i></span><small><br>" + createdDate + "</small></div>"
        
        if (cat.category == 1) {

            var new1 = $("#waiting");
            
            new1.append(tasksDisplay);
            
        } else if (cat.category == 2) {
            var inprogress = $("#inprogressTasks");
            inprogress.append(tasksDisplay);
            
        }
        else  {
            $("#completedTasks").append(tasksDisplay);
            var thisClass = $(".delete.fa-close")
            $(thisClass).removeClass("fa-close")
            $(thisClass).addClass("fa-trash")
        }
        // htmlParser()

    }


// Feeds the Html file with tasks
function htmlParser(){
    
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

                    loopTasks(data, true)
                    $("#formToggler").addClass("collapsed");
                    $("#newTask").removeClass("show");
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
    var formUrl = "/api/tasks/update/" + thisId + "/"

    formId.submit(function(){
        event.preventDefault();
        var thisData = $(this);
        var formData = thisData.serialize();

        updateTask(formData, formUrl, thisId)
    });

    // Toggle the form and hiding the task
    formId.removeClass("d-none").hide(0, function(){
        $(this).show(250);
    });
    $("#card" + thisId).slideDown(300, function(){
        $(this).hide(250);
    });

    // Closing the form
    $("#close" + thisId).click(function(){
        $("#card" + thisId).show(250);
    formId.slideUp(250, function(){
            $(this).addClass("d-none");
        })
    });
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
            $("#form" + taskId).slideUp()
            loopTasks(data, true)
        },
        errors : function(data){
            alert("Errors")
        },
  })
}

function deleteTask() {
    var thisId = event.target.id;
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














