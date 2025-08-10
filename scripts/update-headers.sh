#!/bin/bash

# List of files to update
files=(
  "app/shifts/page.tsx"
  "app/inventory/page.tsx"
  "app/schedule-change/page.tsx"
  "app/sites/page.tsx"
  "app/dashboard/page.tsx"
)

for file in "${files[@]}"; do
  echo "Updating $file..."
  
  # Add imports if not present
  if ! grep -q "import DandoriLogo" "$file"; then
    sed -i '' "s/'use client'/'use client'\n\nimport DandoriLogo from '@\/components\/DandoriLogo'\nimport { NotificationIcon, UserIcon } from '@\/components\/Icons'/" "$file"
  fi
  
  # Replace the logo div with DandoriLogo component
  sed -i '' '/<div style={{$/{
    N;N;N;N;N;N;N;N;N;N;N;
    s/<div style={{[^}]*background: .linear-gradient[^}]*}}>.*📅.*<\/div>/<DandoriLogo size={36} \/>/
  }' "$file"
  
  # Replace HVAC Scheduler with Dandori Scheduler
  sed -i '' 's/HVAC Scheduler/Dandori Scheduler/g' "$file"
done

echo "Done!"