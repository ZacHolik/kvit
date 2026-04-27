#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: ./audits/compare.sh audit1.md audit2.md" >&2
  exit 1
fi

first="$1"
second="$2"

if [ ! -f "$first" ]; then
  echo "Missing file: $first" >&2
  exit 1
fi

if [ ! -f "$second" ]; then
  echo "Missing file: $second" >&2
  exit 1
fi

diff -u "$first" "$second"
