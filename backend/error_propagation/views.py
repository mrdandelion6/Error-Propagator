from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .error_propagator import propagate_errors
import json

# we do not need csrf protection for this view. we are not processing any
# protected data.
@csrf_exempt
def process_data(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # the actual processing is done in the propagate_errors function
        result = propagate_errors(data)
        return JsonResponse({'result': result})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)