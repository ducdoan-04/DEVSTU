import urllib.request
import json
import base64
import os
from PIL import Image, ImageDraw
from io import BytesIO

# Create a test portrait image: white bg with a person shape
img = Image.new('RGB', (400, 500), color=(220, 220, 220))
d = ImageDraw.Draw(img)
# Head
d.ellipse([150, 60, 250, 180], fill=(230, 190, 160))
# Body / shirt
d.polygon([(100, 200), (300, 200), (320, 480), (80, 480)], fill=(70, 130, 180))

bio = BytesIO()
img.save(bio, format='PNG')
img_b64 = 'data:image/png;base64,' + base64.b64encode(bio.getvalue()).decode('ascii')

req_data = json.dumps({'image_base64': img_b64}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:3000/api/extract_matte', data=req_data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        print("extract_matte response ok:", res.get("ok"))
        print("engine:", res.get("engine"))
        matte = res.get("matte_data_url")
        if matte:
            print("matte_data_url length:", len(matte))
            # Save matte to disk to inspect
            m_bytes = base64.b64decode(matte.split(",")[1])
            with open("test_extracted_matte.png", "wb") as f:
                f.write(m_bytes)
            print("Saved test_extracted_matte.png")
        else:
            print("No matte_data_url in response:", res)
except Exception as e:
    print("extract_matte request failed:", e)
