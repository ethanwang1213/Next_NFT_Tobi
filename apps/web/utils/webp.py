import os
from PIL import Image
from tqdm import tqdm
import glob

file_list = glob.glob("./**/*.png",recursive=True)+glob.glob("./**/*.jpg",recursive=True)+glob.glob("./**/*.jpeg",recursive=True)
print(file_list)

for file in tqdm(file_list):
    im = Image.open(file)
    im.save(".".join(file.split(".")[:-1])+".webp", quality=75)
    os.remove(file)