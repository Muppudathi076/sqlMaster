import re
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializer import LoginSerializer,RegisterSerializer,UserdetailsSerializer
from .jwt_utils import generate_custom_access_token,CustomJWTAuthentication
from .models import SQLQuestion,Login,UserProgress
from django.db import connection 
from django.utils.timezone import now
from django.db.models import Count, Sum,Q
from datetime import datetime, timedelta

@api_view(['POST'])
def register_view (requst):
    serizlizer = RegisterSerializer(data = requst.data)
    
    if serizlizer.is_valid():
        serizlizer.save() 
        return Response(
            {"message":"User register successfull"},
            status=200
        )
    return Response(serizlizer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data
        user.last_login_time = now()
        user.save()
        tokens = generate_custom_access_token(user)

        return Response({
            "message": "Login success",
            "access": tokens,
            "name": user.Name,
            "admin_name": user.Email,
            "role": user.role,
        }, status=200)

    return Response(serializer.errors, status=400)

@api_view(['POST'])
def logout_view(request):
    user_id = request.data.get("user_id")

    try:
        user = Login.objects.get(id=user_id)

        if user.last_login_time:
            logout_time = now()
            session_time = logout_time - user.last_login_time
            user.total_spend_time += session_time
            user.last_login_time = None
            user.save()

        return Response({"message": "Logout success"})

    except Login.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['PUT'])
@authentication_classes([CustomJWTAuthentication])
def change_password(request):

    user = request.user 
    new_password = request.data.get("new_password")

    if not new_password:
        return Response({"error": "All fields required"}, status=400)

    user.Password = new_password
    user.save()

    return Response({"message": "Password updated successfully"},status=200)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])  
@permission_classes([IsAuthenticated])
def get_user_details(request):

    user = request.user   

    serializer = UserdetailsSerializer(user)

    return Response(serializer.data)
    
@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication]) 
@permission_classes([IsAuthenticated])
def get_questions(request, model_id):

    user = request.user

    completed_questions = UserProgress.objects.filter(
        user=user,
        is_completed=True
    ).values_list('question_id', flat=True)

    remaining_questions = SQLQuestion.objects.filter(
        model_no=model_id
    ).exclude(id__in=completed_questions).values("id","question", "model_no")

    return Response(remaining_questions)


from rest_framework.decorators import api_view
from rest_framework.response import Response
import sqlite3

@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication]) 
@permission_classes([IsAuthenticated])
def answer_checking(request, questionId):

    query = request.data.get("query")

    try:
        question = SQLQuestion.objects.get(id=questionId)
    except SQLQuestion.DoesNotExist:
        return Response({"success": False, "message": "Question not found"})

    try:
        conn = sqlite3.connect(":memory:")
        cursor = conn.cursor()

        cursor.executescript(question.schema)

        insert_query = "INSERT INTO customers VALUES (?, ?, ?)"
        cursor.executemany(insert_query, question.sample_data)

        cursor.execute(query)

        if query.strip().lower().startswith("select"):
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()

            data = [dict(zip(columns, row)) for row in rows]

        else:
            data = []

        return Response({
            "success": True,
            "data": data
        })

    except Exception as e:
        return Response({
            "success": False,
            "message": str(e)
        })
        
# @api_view(['POST'])
# @authentication_classes([CustomJWTAuthentication])
# @permission_classes([IsAuthenticated])
# def answer_checking(request, questionId):
    
#     question = SQLQuestion.objects.get(id=questionId)

#     user_query = request.data.get('query', '').strip().lower()
#     correct_query = question.answer.strip().lower()

#     def normalize(q):
#         return q.replace(";", "").replace(" ", "")

#     if normalize(user_query) == normalize(correct_query):

#         # ✅ progress update
#         UserProgress.objects.update_or_create(
#             user=request.user,
#             question=question,
#             defaults={"is_completed": True}
#         )

#         # 🔥 DUMMY OUTPUT (based on question)
#         if "customers" in correct_query:
#             data = [
#                 {"name": "Ram"},
#                 {"name": "John"},
#                 {"name": "Priya"}
#             ]
#         else:
#             data = []

#         return Response({
#             "success": True,
#             "message": "Correct answer",
#             "data": data
#         })

#     return Response({
#         "success": False,
#         "message": "Query is incorrect"
#     })
                
@api_view(['POST'])
def run_query(request):
    user_query = request.data.get("query")

    try:
        with connection.cursor() as cursor:
            cursor.execute(user_query)

            if user_query.lower().startswith("select"):
                result = cursor.fetchall()
                return Response({
                    "status": "success",
                    "data": result
                })
            else:
                return Response({
                    "status": "success",
                    "message": "Query executed successfully"
                })

    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        })

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    user = request.user

    total_score = UserProgress.objects.filter(
        user=user,
        is_completed=True
    ).count()

    total_time = user.total_spend_time

    users = Login.objects.annotate(
        score=Count('userprogress', filter=Q(userprogress__is_completed=True))
    ).order_by('-score')

    user_list = list(users)

    global_rank = next(
        (i + 1 for i, u in enumerate(user_list) if u.id == user.id),
        0
    )

    total_questions = SQLQuestion.objects.count()
    total_courses = total_questions // 10

    cards = {
        "total_score": total_score,
        "total_time": total_time,
        "global_rank": global_rank,
        "total_courses": total_courses
    }
    
    today = datetime.today()

    total_seconds = user.total_spend_time.total_seconds()

    daily_avg = total_seconds / 7 if total_seconds else 0

    weekly_data = []
    for i in range(7):
        day = today - timedelta(days=i)

        weekly_data.append({
            "day": day.strftime("%a"),
            "time": round(daily_avg / 60, 2)  
        })

    weekly_data.reverse()

    monthly_data = []
    daily_avg_month = total_seconds / 30 if total_seconds else 0

    for i in range(30):
        day = today - timedelta(days=i)

        monthly_data.append({
            "date": day.strftime("%d"),
            "time": round(daily_avg_month / 60, 2)
        })

    monthly_data.reverse()

    table_data = []

    models = SQLQuestion.objects.values('model_no').annotate(
        total=Count('id')
    )

    for m in models:
        model_no = m['model_no']
        total = m['total']

        solved = UserProgress.objects.filter(
            user=user,
            question__model_no=model_no,
            is_completed=True
        ).count()

        remaining = total - solved
        progress = int((solved / total) * 100) if total > 0 else 0

        table_data.append({
            "topic": f"Level {model_no}",
            "total": total,
            "solved": solved,
            "remaining": remaining,
            "progress": f"{progress}%"
        })

    total_solved = UserProgress.objects.filter(
        user=user,
        is_completed=True
    ).count()

    total_questions = SQLQuestion.objects.count()

    in_process = total_questions - total_solved

    pie_chart = [
        {"name": "Process", "value": total_solved},
        {"name": "In process", "value": in_process}
    ]

    return Response({
        "cards": cards,
        "weekly_chart": weekly_data,
        "monthly_chart": monthly_data,
        "table": table_data,
        "pie_chart": pie_chart
    })