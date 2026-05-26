import cv2
import mediapipe as mp
import numpy as np
# 匯入新版 Tasks API
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# 步驟三與四：初始化 MediaPipe Tasks Pose
# 1. 設定模型路徑 (指向剛下載的 .task 檔案)
base_options = python.BaseOptions(model_asset_path=r"C:\Users\student\Desktop\emotion no damage\pose_landmarker_lite.task")

# 2. 設定偵測參數
options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO,  # 對應舊版的 static_image_mode=False (連續視訊模式)
    min_pose_detection_confidence=0.5,      # 對應舊版的 min_detection_confidence
    min_tracking_confidence=0.5             # 對應舊版的 min_tracking_confidence
)

# 3. 建立 Pose Landmarker 偵測器物件
detector = vision.PoseLandmarker.create_from_options(options)

print("新版 MediaPipe Pose 初始化完成！")