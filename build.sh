#!/bin/bash
cd postpre
if [ "$1" = "install" ] || [ ! -d "node_modules" ]; then
    echo "running \`npm install\` in postpre submodule"
    npm install
fi
npm run p5
mv p5bundle.js ..
cd ..
echo "/* post5 0.1.0 | (c) 2020, Cole Granof | MIT License */" > post5.js
cat p5bundle.js p5extensions.js >> post5.js
rm p5bundle.js
