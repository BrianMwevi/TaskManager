from django.urls import path, re_path

from .views import TaskNewList, TaskCreate, TaskUpdate, TaskDelete

app_name = 'api'

urlpatterns = [
	path('tasks/', TaskNewList.as_view(), name='api_list'),
	# path('tasks/', TaskDoingList.as_view(), name='api_list'),
	path('tasks/create/', TaskCreate.as_view(), name='api_create'),
	path('tasks/update/<int:pk>/', TaskUpdate.as_view(), name='api_update'),
	path('tasks/delete/<int:pk>/', TaskDelete.as_view(), name='api_delete'),

]
