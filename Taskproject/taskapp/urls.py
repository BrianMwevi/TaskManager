from django.urls import path, re_path

app_name = 'taskapp'

from .views import TaskListView, TaskCreateView, TaskUpdateView

urlpatterns = [
	path('', TaskListView.as_view(),name='task_list'),
	path('create/', TaskCreateView.as_view(),name='task_create'),
	path('update/', TaskUpdateView.as_view(),name='task_update'),
]