#!/bin/sh
# Render runtime config for Asgard web.
# Reads env vars set by the Blueprint and writes /usr/share/nginx/html/config.js
# so the SPA can pick up apiOrigin + auto-login admin creds without a rebuild.
set -eu

cat > /usr/share/nginx/html/config.js <<EOF
window.__ASGARD_CONFIG__ = {
  apiOrigin: "${ASGARD_API_ORIGIN:-}",
  adminEmail: "${ADMIN_EMAIL:-admin@asgard.dev}",
  adminPassword: "${ADMIN_PASSWORD:-password}",
};
EOF
