var taskList = [];

function getIds(){
    var thisId = event.target.id;
    var formId = "#form" + thisId;

    updateForm(formId)
    $("#form" + thisId).fadeIn(500).removeClass("d-none");
    $("#card" + thisId).slideDown(300, function(){
        $(this).hide(500);
    });

    $("#close" + thisId).click(function(){
        $("#card" + thisId).show(250);
        $("#form" + thisId).slideUp(250, function(){
            $(this).addClass("d-none");
        })


    });
    // alert(thisId)
};

function updateForm(id){

      $(id).submit(function(event){
        event.preventDefault()
        var this_ = $(this);
        var formData = (this_.serialize());
        $.ajax({
            url : "/api/tasks/create/",

            method : "POST",

            data : formData,

            success : function(data){
                $(id).slideUp(300, function(){
                    $(this).addClass("d-none");
                })
                fetchTasks();
            },

            errors : function(data){
                alert("Not created!");
            }

        }) 
    })
}

function parseTasks(){

   $.each(taskList, function(key, value){
        var userTask = value.user.username;
        var taskTitle = value.title;
        var taskContent = value.content;
        var taskId= value.id;
        var formToken = '{% csrf_token %}';
        var formTokenValue = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        var createdDate = value.created_date;
        var htmlParser = "<div><form action='/tasks/new/' method='POST' class='gradient d-none' id=form" + taskId + "><input type='hidden'  name='csrfmiddlewaretoken' value='" + formTokenValue + "'" + " id='token" + taskId + "'" + "><div></div><div class='form-group'>\
                            <span closeUpdate'><i class='btn fa fa-close float-right btn-dark rounded p-1 m-1' id=close" + taskId + " ></i></span><input type='text' class='form-control form_create border-0' required value='" + taskTitle+ "'" + " name='title' autofocus=''></div>\
                            <div class='form-group'><textarea name='content' class='form_create form-control border-0' required autofocus=''>" + taskContent + "</textarea></div>\
                            <input type='submit' class='btn gradient' value='Update' id='submit" + taskId + "'" + "></form></div><div id=card" + taskId + " class='card my-1 gradient'><div class='card-body p-2'><h5 class='d-inline'> " + taskTitle +
                            "</h5><span class='float-right'><i class='btn btn-sm fa fa-pencil px-2 text-success' onclick='getIds()' id=" + taskId + ">\
                            </i><i class='btn fa fa-close px-2'></i></span><small><br>" + createdDate + "</small></div></div>"
        $("#waitingTask").append(htmlParser);
        
    });
    
};

function fetchTasks(){
        $.ajax({
        url    : '/api/tasks/',
        method : 'GET',
        data   : 'data',
        success: function(data){
            taskList = data;
            parseTasks();
            
        },


    });
}



$(document).ready(function(){

    // Ajax call
    fetchTasks();
  

});
