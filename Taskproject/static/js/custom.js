// FETCHING ALL THE TASKS WHEN THE DOCUMENT IS READY
var formTokenValue = document.getElementsByName('csrfmiddlewaretoken')[0].value;
$(document).ready(function(){
    fetchTasks()
})

// Feeds the Html file with tasks
function htmlParser(waiting){
    
    $("#waitingTasks").prepend(waiting);
}

// Getting the tasks from the database
function fetchTasks(){
    $.ajax({
        url : "/api/tasks/",
        method : "GET",
        data : "data",
        success : function(data){
            var cat1 = [];
            var cat2 = [];
            var cat3 = [];
            $.each(data, function(key, value){
                if (value.category == 1) {
                    cat1.push(value)

                } else if(value.category == 2){
                    cat2.push(value);

                } else if(value.category == 3){
                    cat3.push(value);
                }
                else {
                    alert("No Tasks")
                }
            })
            waitingTasks(cat1);
            // inprogressTasks(cat2);
            // completedTasks(cat3);

        }
    })
}

// Creating New Tasks
function createForm(){
    var form = $("#createForm");
    form.submit(function(){
        event.preventDefault();
        var thisData = $(this);
        var formData = thisData.serialize();

        $.ajax({
            url     : "/api/tasks/create/",
            method  : "POST",
            data    : formData,
            success : function(data){
                $("#newTask").slideUp(250);
                fetchTasks()
            },
            errors  : function(data){

            },
        })
    });
        

};

// TASK HTML CONTENT DESIGN
function waitingTasks(cat1, cat2, cat3){

    $.each(cat1, function(key, value){
        
        function taskDesign(){
            
            var taskId = value.id;
            var title = value.title;
            var detail = value.content;
            var createdDate = value.created_date;

            var tasksDisplay = "<div><form action='/tasks/new/' method='POST' class='gradient d-none' id='form" + taskId + "'" + "><input type='hidden'  name='csrfmiddlewaretoken' value='" + formTokenValue + "'" + " id='token" + taskId + "'" + "><div></div><div class='form-group'>\
                                <span closeUpdate'><i class='btn fa fa-close float-right btn-dark rounded p-1 m-1' id='close" + taskId + "'" + " ></i></span><input type='text' class='form-control form_create border-0' required value='" + title+ "'" + " name='title' autofocus=''></div>\
                                <div class='form-group'><textarea name='content' class='form_create form-control border-0' required autofocus=''>" + detail + "</textarea></div>\
                                <input type='submit' class='btn gradient' value='Update' id='submit" + taskId + "'" + "></form></div><div id='card" + taskId + "'" + " class='card my-1 gradient'><div class='card-body p-2'><h5 class='d-inline'> " + title +
                                "</h5><span class='float-right'><i class='btn btn-sm fa fa-pencil px-2 text-success' onclick='updateForm()' id='" + taskId + "'" + ">\
                                </i><i class='btn fa fa-close px-2'></i></span><small><br>" + createdDate + "</small></div></div>"

            htmlParser(tasksDisplay);
        }

        taskDesign()
        // updateForm(title, detail);                      
        createForm();
        // deleteForm();
    });
}

// Tasks in progress
function inprogressTasks(cat2){
    $.each(cat2, function(key, value){
        var taskId = value.id;
        var title = value.title;
        var detail = value.detail;
        var createdDate = value.created_date;

        updateForm(title, detail);
        $("#inprogressTasks").append(waitingTasks.tasksDisplay);
        updateForm(title, detail);
        deleteForm();
    });
}

// Completed tasks
function completedTasks(cat3){
    $.each(cat3, function(key, value){
        var taskId = value.id;
        var title = value.title;
        var detail = value.detail;
        var createdDate = value.created_date;

        $("#completedTasks").append(tasksDisplay);
        deleteForm();
    })
}

// Updating existing tasks
function updateForm(){
    var thisId = event.target.id; // getting id of the task to be edited

    // Toggle the form and hiding the task
    $("#form" + thisId).removeClass("d-none").hide(0, function(){
        $(this).show(250);
    });
    $("#card" + thisId).slideDown(300, function(){
        $(this).hide(249);
    });


    $("#close" + thisId).click(function(){
        $("#card" + thisId).show(250);
        $("#form" + thisId).slideUp(250, function(){
            $(this).addClass("d-none");
        })


    });
}

// Ajax post call

function updateTask(){
    $.ajax({
        url     : "/api/tasks/update/",
        method  : "POST",
        data    : 'data',
        success : function(){
            alert("success")
        },
        errors  : function(){
            alert("Errors")
        },
    })

}




















// var taskList = [];

// function getIds(){
//     var thisId = event.target.id;
//     var formId = "#form" + thisId;

//     updateForm(formId)
    // $("#form" + thisId).fadeIn(500).removeClass("d-none");
    // $("#card" + thisId).slideDown(300, function(){
    //     $(this).hide(500);
    // });

//     $("#close" + thisId).click(function(){
//         $("#card" + thisId).show(250);
//         $("#form" + thisId).slideUp(250, function(){
//             $(this).addClass("d-none");
//         })


//     });
//     // alert(thisId)
// };

// function updateForm(id){

//       $(id).submit(function(event){
//         event.preventDefault()
//         var this_ = $(this);
//         var formData = this_.serialize();
//         $.ajax({
//             url : "/api/taskss/create/",

//             method : "POST",

//             data : formData,

//             success : function(data){
//                 $(id).slideUp(300, function(){
//                     $(this).addClass("d-none");
//                 })
//                 fetchTasks();
//             },

//             errors : function(data){
//                 alert("Not created!");
//             }

//         }) 
//     })
// }

// function parseTasks(){

//    $.each(taskList, function(key, value){
//         var userTask = value.user.username;
//         var taskTitle = value.title;
//         var taskContent = value.content;
//         var taskId= value.id;
//         var formToken = '{% csrf_token %}';
//         var formTokenValue = document.getElementsByName('csrfmiddlewaretoken')[0].value;
//         var createdDate = value.created_date;
        // var htmlParser = "<div><form action='/tasks/new/' method='POST' class='gradient d-none' id=form" + taskId + "><input type='hidden'  name='csrfmiddlewaretoken' value='" + formTokenValue + "'" + " id='token" + taskId + "'" + "><div></div><div class='form-group'>\
        //                     <span closeUpdate'><i class='btn fa fa-close float-right btn-dark rounded p-1 m-1' id=close" + taskId + " ></i></span><input type='text' class='form-control form_create border-0' required value='" + taskTitle+ "'" + " name='title' autofocus=''></div>\
        //                     <div class='form-group'><textarea name='content' class='form_create form-control border-0' required autofocus=''>" + taskContent + "</textarea></div>\
        //                     <input type='submit' class='btn gradient' value='Update' id='submit" + taskId + "'" + "></form></div><div id=card" + taskId + " class='card my-1 gradient'><div class='card-body p-2'><h5 class='d-inline'> " + taskTitle +
        //                     "</h5><span class='float-right'><i class='btn btn-sm fa fa-pencil px-2 text-success' onclick='getIds()' id=" + taskId + ">\
        //                     </i><i class='btn fa fa-close px-2'></i></span><small><br>" + createdDate + "</small></div></div>"
//         $("#waitingTask").append(htmlParser);
        
//     });
    
// };

// function fetchTasks(){
//         $.ajax({
//         url    : '/api/tasks/',
//         method : 'GET',
//         data   : 'data',
//         success: function(data){
//             taskList = data;
//             parseTasks();
            
//         },


//     });
// }



// $(document).ready(function(){

//     // Ajax call
//     fetchTasks();
  

// });
