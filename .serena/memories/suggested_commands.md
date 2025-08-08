# Suggested Commands for Air Conditioning Scheduler

## Development Commands

### Starting Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Access at http://localhost:3000

# Start on different port if needed
PORT=3001 npm run dev
```

### Building and Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Type checking (Note: no dedicated script, use tsc directly)
npx tsc --noEmit
```

### Deployment
```bash
# Deploy to Vercel using CLI
vercel --prod

# Deploy using script
./deploy.sh

# Deploy to staging (without --prod flag)
vercel
```

## Git Commands
```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "commit message"

# Push to GitHub (triggers automatic Vercel deployment)
git push origin main
```

## Troubleshooting Commands
```bash
# Clean install (when facing dependency issues)
rm -rf node_modules package-lock.json .next
npm install

# Clear Next.js cache
rm -rf .next

# Check for TypeScript errors
npx tsc --noEmit

# Kill process on port 3000 (macOS)
lsof -ti:3000 | xargs kill -9
```

## System Utilities (macOS/Darwin)
```bash
# List files (macOS uses same as Linux)
ls -la

# Find files
find . -name "*.tsx"

# Search in files (use ripgrep if available)
grep -r "searchterm" .
# or better:
rg "searchterm"

# Navigate directories
cd directory_name
cd ..
cd ~

# View file content
cat filename
head -n 20 filename
tail -n 20 filename
```

## Project-Specific Notes
- **No test scripts** configured yet (Jest/Cypress suggested for future)
- **No formatter** configured (Prettier recommended)
- **No pre-commit hooks** configured
- **Environment variables** not currently used but can be added in `.env.local`
- **Vercel auto-deploy** enabled on push to main branch