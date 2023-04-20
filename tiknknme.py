import cv2
import os

# Path to directory containing images C:\Users\Raviraj\Desktop\javascript_login\public\images
img_folder_path = "C:/Users/Raviraj/Desktop/javascript_login/public/images"

# Path to output directory for video file
out_folder_path = "C:/Users/Raviraj/Desktop/javascript_login/public/videos"


# Output video file name and codec
out_filename = "output.mp4v"
fourcc = cv2.VideoWriter_fourcc(*"XVID")

# Read in all image files in the directory
images = [img for img in os.listdir(img_folder_path) if img.endswith(".jpg")]

# Sort the images in ascending order by filename
images.sort()

# Set the frame size of the output video
frame = cv2.imread(os.path.join(img_folder_path, images[0]))
height, width, layers = frame.shape

# Create the VideoWriter object
out_path = os.path.join(out_folder_path, out_filename)
video = cv2.VideoWriter(out_path, fourcc, 10, (width, height))

# Loop through each image in the directory and write it to the video
for image in images:
    img_path = os.path.join(img_folder_path, image)
    frame = cv2.imread(img_path)
    video.write(frame)

# Release the VideoWriter object and close all windows
video.release()
cv2.destroyAllWindows()