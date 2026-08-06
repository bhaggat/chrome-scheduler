import os
import glob
from PIL import Image

def process_image(src_path, dest_path, target_width, target_height):
    print(f"Processing {os.path.basename(src_path)} -> {target_width}x{target_height} (24-bit PNG RGB)...")
    im = Image.open(src_path)
    
    # Convert RGBA to RGB (stripping alpha channel completely for strict 24-bit PNG)
    if im.mode != 'RGB':
        # Create solid background if needed
        bg = Image.new('RGB', im.size, (11, 15, 25))
        if im.mode == 'RGBA':
            bg.paste(im, mask=im.split()[3])
        else:
            bg.paste(im)
        im = bg
        
    # Resize to exact dimensions using Lanczos filter
    im_resized = im.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Save as PNG without alpha
    im_resized.save(dest_path, format='PNG')
    
    # Verify saved image
    saved_im = Image.open(dest_path)
    print(f"  Saved {os.path.basename(dest_path)}: size={saved_im.size}, mode={saved_im.mode}")

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dir = os.path.join(root_dir, 'chrome-store-assets', 'raw')
    screenshots_dir = os.path.join(root_dir, 'chrome-store-assets', 'screenshots')
    promo_dir = os.path.join(root_dir, 'chrome-store-assets', 'promo')
    
    os.makedirs(screenshots_dir, exist_ok=True)
    os.makedirs(promo_dir, exist_ok=True)

    # 1. Screenshots (1280x800)
    screenshot_files = [
        '1-overview-dashboard.png',
        '2-flexible-scheduler.png',
        '3-smart-triggers.png',
        '4-pinned-tabs-settings.png',
        '5-modern-design-quality.png',
    ]

    for fname in screenshot_files:
        src = os.path.join(raw_dir, fname)
        if os.path.exists(src):
            dst = os.path.join(screenshots_dir, fname)
            process_image(src, dst, 1280, 800)

    # 2. Small Promo Tile (440x280)
    small_src = os.path.join(raw_dir, 'small-promo-440x280.png')
    if os.path.exists(small_src):
        small_dst = os.path.join(promo_dir, 'small-promo-440x280.png')
        process_image(small_src, small_dst, 440, 280)

    # 3. Marquee Promo Tile (1400x560)
    marquee_src = os.path.join(raw_dir, 'marquee-promo-1400x560.png')
    if os.path.exists(marquee_src):
        marquee_dst = os.path.join(promo_dir, 'marquee-promo-1400x560.png')
        process_image(marquee_src, marquee_dst, 1400, 560)

    # Also check rewriter-ai store assets if present
    rewriter_dir = '/Users/kanukabhagat/Desktop/projects/rewriter-ai/chrome-store-assets'
    if os.path.exists(rewriter_dir):
        print("\n--- Also processing rewriter-ai assets for 100% store spec compliance ---")
        rewriter_screenshots = glob.glob(os.path.join(rewriter_dir, 'screenshots', '*.png'))
        for p in rewriter_screenshots:
            process_image(p, p, 1280, 800)
        
        rewriter_small = os.path.join(rewriter_dir, 'promo', 'small-promo-440x280.png')
        if os.path.exists(rewriter_small):
            process_image(rewriter_small, rewriter_small, 440, 280)
            
        rewriter_marquee = os.path.join(rewriter_dir, 'promo', 'marquee-promo-1400x560.png')
        if os.path.exists(rewriter_marquee):
            process_image(rewriter_marquee, rewriter_marquee, 1400, 560)

if __name__ == '__main__':
    main()
