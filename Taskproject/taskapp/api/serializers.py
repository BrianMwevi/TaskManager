from rest_framework import serializers

from django.utils.timesince import timesince

from taskapp.models import Task

from accounts.api.serializers import UserDisplaySerializer


class TaskModelSerializer(serializers.ModelSerializer):
	user = UserDisplaySerializer(read_only=True,)
	# category = serializers.SerializerMethodField(write_only=True)
	created_date = serializers.SerializerMethodField()

	class Meta:

		model = Task

		fields = (
			'id',
			'user',
			'title',
			'content',
			'category',
			'created_date',

		)

	def get_created_date(self, obj):
		return "Past " + timesince(obj.created_date)
	# def get_category(self, obj):
	# 	return self
