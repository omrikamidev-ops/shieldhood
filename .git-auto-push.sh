#!/bin/bash
# Auto-push script
cd "$(dirname "$0")"
git push origin main 2>&1
