#! /bin/bash
echo "Building the Fable-Log web module..."

echo "...merging in package.json browserify extensions"
node ./build_tools/Merge_Browserify_Additions.js

echo "...building with gulp..."
./node_modules/.bin/gulp build

echo "... restoring backup of package.json"
mv ./build_tools/base_package.json ./package.json

echo "...  build complete!"
