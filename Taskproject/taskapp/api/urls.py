from django.urls import path, re_path

from .views import TaskNewList, TaskCreate, TaskUpdate

app_name = 'api'

urlpatterns = [
	path('tasks/', TaskNewList.as_view(), name='api_list'),
	# path('tasks/', TaskDoingList.as_view(), name='api_list'),
	path('tasks/create/', TaskCreate.as_view(), name='api_create'),
	path('tasks/<int:pk>/update/', TaskUpdate.as_view(), name='api_update'),
]