from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', views.me_view, name='me'),
    path('change-password/', views.change_password_view, name='change_password'),
]
