#!/bin/bash

# create the zip to upload a new manfiest to Chrome Web Store
# renames webstore -> fiveormore, zips it, then renames back

mv webstore fiveormore && zip -r fiveormore.zip fiveormore && mv fiveormore webstore
