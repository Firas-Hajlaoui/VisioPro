from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permission class that only allows admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsManagerOrAdmin(permissions.BasePermission):
    """
    Permission class that allows managers and admins.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'manager']


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission class that allows the owner of an object or admins.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        
        # Check if the object has an employee field
        if hasattr(obj, 'employee'):
            return obj.employee == request.user
        
        # Check if the object has a user field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False
