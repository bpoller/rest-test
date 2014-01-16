#!/bin/bash

BONSAI_URL=`heroku config | grep BONSAI | cut -d ' ' -f2`

echo "Initialising index in Elastic Search"

curl -X POST  $BONSAI_URL/posting -d '{"ok":true, "acknowledged":true}'
