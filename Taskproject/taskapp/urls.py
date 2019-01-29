from django.urls import path, re_path

app_name = 'taskapp'

from .views import TaskListView, TaskCreateView

urlpatterns = [
	path('', TaskListView.as_view(),name='task_list'),
	path('new/', TaskCreateView.as_view(),name='task_create'),
	# path('', TaskCreateView.as_view(),name='task_create'),
]