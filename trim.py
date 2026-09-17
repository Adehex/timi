from PIL import Image

# Open the image
img = Image.open('public/logo-transparent.png')

# Get the bounding box of the non-transparent alpha channel
bbox = img.getbbox()

if bbox:
    # Crop to the bounding box
    trimmed = img.crop(bbox)
    trimmed.save('public/logo-transparent.png')
    print(f"Trimmed image to {trimmed.size}")
else:
    print("Image is entirely transparent or couldn't find bbox")
