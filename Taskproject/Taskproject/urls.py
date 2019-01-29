from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
	path('', views.home, name='home'),
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('accounts/', include('django.contrib.auth.urls')),
 #    path('me/', include('user_profile.urls', namespace='user_profile')),
	path('tasks/', include('taskapp.urls', namespace='taskapp')),
	path('api/', include('taskapp.api.urls', namespace='api')),
	# path('team/', include('team.urls')),
    path('admin/', admin.site.urls),
]
