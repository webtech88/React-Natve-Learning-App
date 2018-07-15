1. Export icons as svgs. In Sketch make sure to convert all elements to outlines Layer / Covert to Outlines.
2. Collate svgs in folder.
3. Open `https://icomoon.io/app`.
4. Drag and drop svgs into app.
5. Generate Font (button at bottom right of page).
6. Download font.
7. Replace the following files:

`app/assets/fonts/icomoon.ttf`
`app/assets/fonts/selection.json`
`android/app/src/main/assets/fonts/icomoon.ttf`
`ios/icomoon.ttf`

8. Rebuild.

NOTE: icomoon converts all svgs to the same height (fontSize is the same as height-in-pixels size when rendered). It'92s less time consuming to export the font like this and set sizes in the code where necessary'97especially as the font will need to be regenerated each time a new icon is needed.

Props set in
common/core/icon.js