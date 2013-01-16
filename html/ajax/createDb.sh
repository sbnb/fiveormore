#!/bin/bash

sqlite3 ../../../protected/fiveormore.db < dbSchema.sql

# insert a pile of fake messages
#sqlite3 fiveormore.db < msginserts.sql