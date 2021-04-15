#!/bin/bash

echo "Installing build dependencies .."
npm i
npx --no-install lerna bootstrap || exit

echo "Building 'util' .."
cd packages/util || exit
rm -r -f  dist
npx tsc || exit

echo "Building 'data' .."
cd ../data || exit
rm -r -f  dist
npm run generate || exit
npx tsc || exit

echo "Building 'mailer' .."
cd ../mailer || exit
rm -r -f  dist
npx tsc || exit

echo "Building 'client' .."
cd ../client || exit
rm -r -f  dist
npx tsc || exit

echo "Building 'server' .."
cd ../server || exit
rm -r -f  dist
npm run generate || exit
npx tsc || exit

cd ../..