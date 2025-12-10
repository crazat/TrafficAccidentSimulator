from PIL import Image

def make_white_transparent(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            r, g, b, a = item
            # If pixel is white (or very light), make it transparent
            # The logo is Cyan, so it has high G and B. White has high R, G, B.
            # We can check if R is high. Cyan has low R.
            
            if r > 200 and g > 200 and b > 200:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Success: Saved {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    make_white_transparent("logo_final.png", "logo_fixed.png")
