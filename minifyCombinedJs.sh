#!/bin/bash

echo "*******************************************************"
echo "* $0 running with combinedJsFile: $1, minified: $2"

htmlDir=html
combined=$1
minified=$2
minify='/usr/bin/java -jar /home/sean/bin/closure_compiler/compiler.jar'

echo "* moving to dir $htmlDir"
cd $htmlDir

echo "* minifying $combined to $minified"
$minify --js=$combined --js_output_file=$minified  2>/dev/null
