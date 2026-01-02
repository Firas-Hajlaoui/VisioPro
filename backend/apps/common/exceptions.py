from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler to return standardized error responses.
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'success': False,
            'data': None,
            'message': str(exc),
            'errors': response.data
        }
        response.data = custom_response_data
    
    return response


def success_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    """
    Create a standardized success response.
    """
    return Response({
        'success': True,
        'data': data,
        'message': message,
        'errors': None
    }, status=status_code)


def error_response(message="Error", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    """
    Create a standardized error response.
    """
    return Response({
        'success': False,
        'data': None,
        'message': message,
        'errors': errors
    }, status=status_code)
