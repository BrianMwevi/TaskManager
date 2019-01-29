from django.urls import path, re_path

from .views import TaskList,TaskCreate

app_name = 'api'

urlpatterns = [
	path('tasks/', TaskList.as_view(), name='api_list'),
	path('tasks/create/', TaskCreate.as_view(), name='api_create'),
]