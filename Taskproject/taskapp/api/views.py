from django.shortcuts import get_object_or_404


from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework import permissions

from .serializers import TaskModelSerializer


from taskapp.models import Task


class TaskNewList(ListAPIView):
	serializer_class = TaskModelSerializer

	def get_queryset(self, *args, **kwargs):
		user_tasks = Task.objects.filter(user__exact=self.request.user)
		print(user_tasks.count())
		# tasksk = Task.objects.filter()
		return user_tasks

class TaskCreate(CreateAPIView):
	serializer_class = TaskModelSerializer
	permission_classes = [permissions.IsAuthenticated]

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class TaskUpdate(UpdateAPIView):
	serializer_class = TaskModelSerializer
	permission_classes = [permissions.IsAuthenticated]

	def perform_update(self, serializer):
		instance = serializer.save()