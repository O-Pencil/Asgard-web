#!/bin/sh
set -eu

cat > /usr/share/nginx/html/config.js <<EOF
window.__ASGARD_CONFIG__ = {
  apiOrigin: "${ASGARD_API_ORIGIN:-}",
};
EOF
