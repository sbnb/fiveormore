#!/bin/bash
set -e

local_dir=html

echo "*******************************************************"
echo "* $0 running"
epochDate=$(date +"%s")
combinedJsFile=js/combined-${epochDate}.js
minifiedJsFile=js/combined-min-${epochDate}.js

./mergejs.sh $combinedJsFile $minifiedJsFile
./turnOffAsserts.sh $combinedJsFile
./minifyCombinedJs.sh $combinedJsFile $minifiedJsFile

# check exit status from minifyCombinedJs.sh

cd $local_dir

target=~/www/tmp/fiveormore.$$
#~ target=sbn_ggm@ssh.phx.nearlyfreespeech.net:fiveormore/

echo "*******************************************************"
echo "back to $0"
echo "* copying relevant files to $target"

rsync -r -v --copy-links \
    --include="js/" \
    --include="${minifiedJsFile}" \
    --include="fiveormore.php" \
    --include="css/" \
    --include="css/fiveormore.css" \
    --include="css/ie7-and-down.css" \
    --include="css/resetdw.css" \
    --include="server.php" \
    --include="imgs/" \
    --include="imgs/loading.gif" \
    --include="imgs/*.png" \
    --include="imgs/mountains.jpg" \
    --exclude="*" \
    . $target

echo "* removing old .uploaded files"
rm js/*.uploaded

echo "* moving $combinedJsFile to ${combinedJsFile}.uploaded"
mv $combinedJsFile ${combinedJsFile}.uploaded

echo "* moving $minifiedJsFile to $minifiedJsFile.uploaded"
mv $minifiedJsFile $minifiedJsFile.uploaded

echo "* moving fiveormore.php to fiveormore.php.uploaded"
mv fiveormore.php fiveormore.php.uploaded

echo "COMPLETE: everything seems OK"
