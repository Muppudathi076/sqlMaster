from django.urls import path 
from .import views

urlpatterns = [
    path('register/',views.register_view),
    path('login/',views.login_view),
    path('logout/',views.logout_view),
    path('questions/<int:model_id>/', views.get_questions),
    path('run-query/', views.run_query),
    path('value/checking/<int:questionId>', views.answer_checking),
    path('change/password/', views.change_password),
    path('user/details/', views.get_user_details),
    path('user/dashboard/', views.user_dashboard),
    path('admins/user/list/', views.all_user_details),
    path('admins/delete/userbyid/<int:userId>', views.delete_user_byid),
    path('admins/models/', views.get_all_question),
    path("admins/question/update/<int:questionId>", views.questionUpdated),
    path("admins/question/delete/<int:questionId>", views.questionDelete),
    path("admins/question/create/", views.questionAdd),
    path("model/complete/<int:model_id>/", views.model_complete),
]