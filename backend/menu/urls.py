
from django.urls import path
from . import views

urlpatterns = [
    path('menu/', views.menu_list, name='menu_list'),
    path('orders/', views.create_order, name='create_order'),
]
