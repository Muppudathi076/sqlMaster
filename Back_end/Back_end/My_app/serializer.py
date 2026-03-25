from rest_framework import serializers
from .models import Login,SQLQuestion

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ['Name','Email','Password']
        extra_kwargs = {
            'Name': {'required': True},
            'Email': {'required': True},
            'Password': {'required': True},
        }
        
    def validate_Email(self, value):
        if Login.objects.filter(Email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def createadmin(self,validation_data):
        user = Login.objects.create_user(
            Name= validation_data['Name'],
            Email= validation_data['Email'],
            Password= validation_data['Password'],
            # role= validation_data['role'],            
        )
        return user
    
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ['Email','Password']
    
    def validate(self,data):
        try:
            user = Login.objects.get(Email = data['Email'])
        except Login.DoesNotExist:
            raise serializers.ValidationError("user not found")
        if user.Password != data['Password'] :
            raise serializers.ValidationError("Invalid Credential")
        return user
    
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SQLQuestion
        fields = "__all__"
        
class UserdetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = "__all__"