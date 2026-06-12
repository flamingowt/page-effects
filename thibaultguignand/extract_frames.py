import cv2
import os

vidcap = cv2.VideoCapture('/Users/dufangchi/Downloads/target_page.mp4')
success, image = vidcap.read()
count = 0
frame_count = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT))
interval = max(1, frame_count // 10) # Extract 10 frames

os.makedirs('frames', exist_ok=True)

while success:
    if count % interval == 0:
        cv2.imwrite(f"frames/frame_{count}.jpg", image)
    success, image = vidcap.read()
    count += 1

print(f"Extracted {count//interval} frames.")
