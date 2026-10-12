A LITTLE BIRTHDAY MAGIC — FOR ANU
================================

READY TO PREVIEW
Open index.html in any modern browser. No build, installation or backend needed.
Keep index.html, style.css, script.js, personalize.js and the photos folder together.
The design includes illustrated placeholders, an opening letter, a birthday wish
with confetti, and optional original music-box audio (off until she taps Sound).

1. ADD YOUR FIVE PHOTOS
Put your photos inside the photos folder and name them:
  1.jpg
  2.jpg
  3.jpg
  4.jpg
  5.jpg

PNG, JPEG and WebP are detected too: for example 1.png or 2.jpeg.
Use actual image files; renaming an HEIC file to .jpg does not convert it.
Export HEIC photos as JPEG first. Both lower- and uppercase extensions work.
Portrait photos look especially nice. Aim for under 1 MB per photo for fast loading.
If no photo is found, a decorative illustration stays in its place.
When added, photos can be tapped to view the full image.

2. WRITE YOUR LETTER
Open personalize.js in your editor. It contains all the main personal touches:
  name        Her name (currently Anu).
  sender      Your name or a sweet sign-off.
  signoff     The line before your name.
  letter      Your letter, split into paragraphs.
  photos      Captions, filenames, and crop positions for all five photos.
  wishMessage The message after she makes her wish.

Replace the sample letter with your own. Keep the backticks around each paragraph
and the commas between paragraphs. Apostrophes are fine inside backticks.
Do not put a literal backtick or ${...} inside your letter without escaping it.
To adjust a photo crop, try position: "center top" rather than "center".
Other text, such as the four reasons, can be edited directly in index.html.
Refresh the browser after saving your changes.

3. GET A LINK TO SEND HER
The site is ready for hosting, but a local file path is NOT a shareable web link.

Simple option — Netlify Drop:
  a. Finish your photos and letter first.
  b. Visit https://app.netlify.com/drop and sign in or create an account if prompted.
  c. Drag the entire website folder onto the upload area.
     index.html must be at the top level of the folder being uploaded.
  d. Netlify will provide an HTTPS address ending in .netlify.app.
  e. Open that address on your phone, test the letter and photos, then send it to her.
  f. To update it later, upload the revised folder to the SAME site's Deploys page.

Choose a free plan if it meets your needs; review the host's current limits and
pricing. No paid services or custom domain are required by this website.
GitHub Pages or Cloudflare Pages can also host these same static files.

BEFORE SHARING
- Check her name, your name, the letter, all captions and all five photos.
- Try the site on a phone. Check Sound, the envelope, and the birthday wish.
- Send the HTTPS link, not the path on your computer.
- Hosting makes the photos and letter public to anyone who has the link.
  Only upload photos she would be comfortable sharing. Nothing is password protected.
  The noindex tag discourages search indexing, but is NOT a privacy guarantee.
- No analytics, tracking, microphone access, forms, or personal-data collection
  are implemented by this site. The hosting provider may keep standard access logs.
- Fonts load from Google Fonts (which receives a normal web request); fallback
  fonts work offline. Remove the first @import line in style.css to avoid that request.
- Music is generated locally by the browser: no external audio files or autoplay.