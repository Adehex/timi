import requests
# Monkey patch requests to skip SSL verification
old_request = requests.Session.request
def new_request(self, method, url, **kwargs):
    kwargs['verify'] = False
    return old_request(self, method, url, **kwargs)
requests.Session.request = new_request

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from rembg import remove
from PIL import Image

print("Starting background removal...")
# Open the original uploaded image to get a fresh start
input_image = Image.open('C:/Users/adeku/.gemini/antigravity/brain/8aef72ef-d024-46e9-a785-a30d470028dc/.user_uploaded/media_1789592484007.png')
output_image = remove(input_image)
output_image.save('public/logo.png')
print("Finished saving logo.png")
