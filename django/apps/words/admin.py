from django.contrib import admin
from .models import (
    WordStat,
    Definition,
    WordUserData,
    WordList,
    # UserWordListDetails,
)

admin.site.register(WordStat)
admin.site.register(Definition)
admin.site.register(WordUserData)
admin.site.register(WordList)
# admin.site.register(UserWordListDetails)
