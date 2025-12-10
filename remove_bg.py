from PIL import Image

def remove_background(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            r, g, b, a = item
            # Simple threshold: if pixel is dark, make it transparent
            if r < 50 and g < 50 and b < 50:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully saved to {output_path}")
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    # Try different source files if one fails
    sources = ["logo_cropped.png", "logo.jpg"]
    for src in sources:
        try:
            print(f"Trying {src}...")
            remove_background(src, "logo_transparent_final.png")
            break
        except:
            continue
