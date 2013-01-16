#!/bin/bash

echo "*******************************************************"
echo "* $0 running with combinedJsFile: $1"

htmlDir=html
combined=$1
combinedBackup=${combined}.bak

echo "* moving to dir $htmlDir"
cd $htmlDir

echo "* removing old .bak files"
rm *.bak

echo "* copying $combined to $combinedBackup"
cp $combined $combinedBackup

echo "* commenting out all console lines"
perl -pi -e 's:(.*)(console.*):$1//$2:' $combined

echo "* setting ASSERTS_ON to false"
perl -pi -e 's:(.*)ASSERTS_ON = true(.*):$1ASSERTS_ON = false$2:' $combined

echo "* setting LOGGING_ON to false"
perl -pi -e 's:(.*)LOGGING_ON = true(.*):$1LOGGING_ON = false$2:' $combined

echo "* setting TEST_FULL_BOARD to false"
perl -pi -e 's:(.*)TEST_FULL_BOARD = true(.*):$1TEST_FULL_BOARD = false$2:' $combined
