import json

from rest_framework.renderers import JSONRenderer


class WordDetailJSONRenderer(JSONRenderer):
    charset = "utf-8"

    def render(self, data, accepted_media_types=None, renderer_context=None):
        return json.dumps({"word_details": data})
