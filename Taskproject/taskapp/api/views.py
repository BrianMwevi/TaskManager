from django.shortcuts import get_object_or_404


from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework import permissions

from .serializers import TaskModelSerializer


from taskapp.models import Task


class TaskList(ListAPIView):
	serializer_class = TaskModelSerializer

	queryset = Task.objects.all().order_by("-created_date")

class TaskCreate(CreateAPIView):
	serializer_class = TaskModelSerializer
	permission_classes = [permissions.IsAuthenticated]

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
	# model = Task
	# fields = ['title', 'detail']
