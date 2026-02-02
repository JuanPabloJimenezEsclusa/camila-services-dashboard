#!/bin/bash

set -e  # Exit on error (disabled for individual test runs)
if [[ "${debug:-}" == "true" ]]; then set -o xtrace; fi  # enable debug mode.

docker run --rm -it \
  --name="camila-product-react-ui" \
  --network=host \
  --memory="256m" --memory-reservation="256m" --memory-swap="256m" --cpu-shares=1000 \
  -p 3030:3030 \
  camila-product-react-ui:1.0.0
