from PIL import Image

# Open the image
img = Image.open('public/logo-transparent.png')

# Calculate new size (4x larger)
new_width = img.width * 4
new_height = img.height * 4

# Resize using Lanczos resampling (best for upscaling graphics)
upscaled = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

# Save it back
upscaled.save('public/logo-transparent.png')
print(f"Upscaled logo to {new_width}x{new_height}")
