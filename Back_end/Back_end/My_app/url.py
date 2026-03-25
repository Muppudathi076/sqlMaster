from django.urls import path 
from .import views

urlpatterns = [
    path('register/',views.register_view),
    path('login/',views.login_view),
    path('questions/<int:model_id>/', views.get_questions),
    path('run-query/', views.run_query),
    path('value/checking/<int:questionId>', views.answer_checking),
    path('change/password/', views.change_password),
    path('user/details/', views.get_user_details),
    path('user/dashboard/', views.user_dashboard),
]