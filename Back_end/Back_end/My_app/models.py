from django.db import models
from datetime import timedelta

class Login(models.Model): ## for register 
    Name = models.CharField(max_length=100, null=True, blank=True)
    Email = models.CharField(max_length=100)
    Password = models.CharField(max_length=100)
    role = models.CharField(max_length=100 ,default="user")
    last_login_time = models.DateTimeField(null=True, blank=True)
    total_spend_time = models.DurationField(default=timedelta(0))
    @property
    def is_authenticated(self):
        return True

class SQLQuestion(models.Model):
    question = models.TextField()
    methods = models.TextField()
    difficulty = models.CharField(max_length=10)
    model_no = models.IntegerField()  
    answer = models.TextField()
    option = models.TextField() 
    sample_data = models.JSONField()
    
class UserProgress(models.Model):
    user = models.ForeignKey(Login, on_delete=models.CASCADE)
    question = models.ForeignKey(SQLQuestion, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    
class DailyUsage(models.Model):
    user = models.ForeignKey(Login, on_delete=models.CASCADE)
    date = models.DateField()
    spend_time = models.DurationField(default=timedelta)