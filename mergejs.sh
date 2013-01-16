#!/bin/bash

# Merge all local js into one file
# Change the js include section of the html file to include just one file

echo "*******************************************************"
echo "* $0 running combinedjsfile: $1, minifiedJsFile: $2"

htmlDir=html
htmlFile=local.php
outHtmlFile=fiveormore.php
jqueryGoogle='  <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>'
jqueryLocal=/lib/jq/jquery
combinedJsFile=$1
minifiedJsFile=$2
combinedJsMarker="<!--combined_js_insert-->"
#combinedJsInclude='<script type="text/javascript" src="combined-min.js"></script>'
combinedJsInclude='<script type="text/javascript" src="'$minifiedJsFile'"></script>'

echo "* moving to dir $htmlDir"
echo "* source html file is ${htmlFile}"
cd $htmlDir

echo "* concatenating local js files into $combinedJsFile"
# read local js from html file
# cat all files together
cat $htmlFile |
    perl -ne 'print if /replace_start/../replace_end/' |
    perl -ne '!/replace_/ && print' |
    perl -ne 'print "$1\n" if /src=\"(.*)\"/' |
    while 
        read jsfile; 
        do 
            #echo $jsfile;
            cat $jsfile
            echo
        done > $combinedJsFile

echo "* removing local js include statements"
echo "* inserting combined js include statement"
echo "* changing local jquery include to google jquery include"
echo "* saving to $outHtmlFile"
# remove local js include statements while copying to outHtmlFile file
cat $htmlFile |
    perl -ne 'print unless /replace_start/../replace_end/' |
    perl -pe "s:${combinedJsMarker}:${combinedJsInclude}:" |
    perl -pe "s:.*${jqueryLocal}.*:${jqueryGoogle}:" > $outHtmlFile

echo "* $0 done"
