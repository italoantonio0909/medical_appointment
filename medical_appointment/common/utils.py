from rest_framework import serializers
from django.core.exceptions import ValidationError


def get_first_matching_attr(obj, *attrs, default=None):
    for attr in attrs:
        if hasattr(obj, attr):
            return getattr(obj, attr)

    return default



def create_serializer_class(name, fields):
    return type(name, (serializers.Serializer, ), fields)



def inline_serializer(*, fields, data=None, **kwargs):
    serializer_class = create_serializer_class(name='', fields=fields)

    if data is not None:
        return serializer_class(data=data, **kwargs)

    return serializer_class(**kwargs)


def update_fields(*, fields: list, data: dict, change):
    """This method allow update only fields in data
    Return fields (Parameters to update) and object
    fields ->['field1','field2']
    data -> Data dict() with key value new data
    change -> Some object update
    
    """

    # Check if data, if no raise ValidationError
    # Data is a dict()
    if not data:
        raise ValidationError('Submit at least one field')

    # Vector to append field to update
    update_fields = []

    for field in fields:
        if field in data:
            setattr(change, field, data[field])
            update_fields.append(field)

    return update_fields, change