#!/bin/sh -e

# set theme
THEME=slta

# remove prev build index.js

sed -i -e "s/theme\-.*'$/theme-$THEME'/g" ./app/styles/index.js
rm -f ./app/styles/index.js-e

# replace logo files

rm -f ./ios/Pearson360/Images.xcassets/LaunchImage.LaunchImage/*
cp -R ./app/assets/images/logo/$(echo $THEME | tr -d '\r')/* ./ios/Pearson360/Images.xcassets/LaunchImage.LaunchImage
cp -R ./app/assets/images/logo/Contents.json ./ios/Pearson360/Images.xcassets/LaunchImage.LaunchImage

# replace launcher icon files

rm -f ./ios/Pearson360/Images.xcassets/AppIcon.appiconset/*
cp -R ./app/assets/images/iconset/$(echo $THEME | tr -d '\r')/* ./ios/Pearson360/Images.xcassets/AppIcon.appiconset
cp -R ./app/assets/images/iconset/Contents.json ./ios/Pearson360/Images.xcassets/AppIcon.appiconset



echo '\n'
echo '|****************************|'
echo '      Build Configured      \n'
echo "   Current Theme:   $THEME    "
echo '|****************************|'
echo '\n'

