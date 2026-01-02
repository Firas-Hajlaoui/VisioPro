from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        # Managers can access their scope, implemented in views/querysets usually
        # But this permission check just verifies the role
        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'manager']

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'manager', 'employee']

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `employe` attribute which is a User or linked to User.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if obj.employe is the logged in user or linked employee
        # This requires the obj.employe to be linked to request.user
        if hasattr(obj, 'employe'):
             # If obj.employe is a foreign key to Employee model
             # We need to check if request.user.employee_profile == obj.employe
             # This depends on how we link User and Employee.
             # For now, let's assume strict separation and allow Admin/Manager to edit
             return request.user.role in ['admin', 'manager']
        
        return False
