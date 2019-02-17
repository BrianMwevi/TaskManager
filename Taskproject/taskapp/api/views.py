from django.shortcuts import get_object_or_404
from django.utils import timezone


from rest_framework.generics import ListAPIView, ListCreateAPIView,RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.mixins import UpdateModelMixin
from rest_framework.response import Response
from rest_framework import permissions, authentication

from .serializers import TaskModelSerializer


from taskapp.models import Task


class TaskNewList(ListAPIView):
	serializer_class = TaskModelSerializer

	def get_queryset(self, *args, **kwargs):
		user_tasks = Task.objects.filter(user__exact=self.request.user)
		# tasksk = Task.objects.filter()
		return user_tasks

class TaskCreate(ListCreateAPIView):
	serializer_class = TaskModelSerializer
	permission_classes = [permissions.IsAuthenticated, permissions.AllowAny]

	def get_queryset(self, *args, **kwargs):
		user_tasks = Task.objects.filter(user__exact=self.request.user)
		return user_tasks

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class TaskUpdate(RetrieveUpdateAPIView):
	serializer_class = TaskModelSerializer
	permission_classes = [permissions.IsAuthenticated]
	authentication_classes = [authentication.SessionAuthentication]
	lookup_field = "pk"	
	
	def get_queryset(self, *args, **kwargs):
		tasks =  Task.objects.all()
		return tasks

	def perform_update(self, serializer):
		print(self.request.user)
		serializer.save(started_date=timezone.now())

	
class TaskDelete(DestroyAPIView):
	serializer_class = TaskModelSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self, *args, **kwargs):
		tasks = Task.objects.all()

		return  tasks
