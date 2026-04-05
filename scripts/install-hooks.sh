#!/usr/bin/env bash
set -euo pipefail

HOOK=".git/hooks/pre-push"

cat > "$HOOK" << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
echo "Running tests before push..."
npm test
EOF

chmod +x "$HOOK"
echo "pre-push hook installed at $HOOK"
