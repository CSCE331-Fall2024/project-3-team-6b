# create-project-structure.ps1

# Create root directory and navigate into it
$rootDir = "project-3"
New-Item -ItemType Directory -Force -Path $rootDir
Set-Location $rootDir

# Client structure
$clientDirs = @(
    "client/src/app/(auth)/login",
    "client/src/app/(auth)/admin",
    "client/src/app/(auth)/cashier",
    "client/src/app/menu",
    "client/src/app/fonts",
    "client/src/components/layout",
    "client/src/components/admin",
    "client/src/components/cashier",
    "client/src/components/menu",
    "client/src/lib",
    "client/src/types",
    "client/public/images"
)

# Server structure
$serverDirs = @(
    "server/src/controllers",
    "server/src/models",
    "server/src/routes",
    "server/src/middleware",
    "server/src/config"
)

# Create directories
foreach ($dir in $clientDirs + $serverDirs) {
    New-Item -ItemType Directory -Force -Path $dir
}

# Create client files
$clientFiles = @(
    "client/.eslintrc.json",
    "client/.gitignore",
    "client/next-env.d.ts",
    "client/next.config.mjs",
    "client/package.json",
    "client/postcss.config.mjs",
    "client/tailwind.config.ts",
    "client/tsconfig.json",
    "client/src/app/favicon.ico",
    "client/src/app/globals.css",
    "client/src/app/layout.tsx",
    "client/src/app/page.tsx",
    "client/src/app/(auth)/login/page.tsx",
    "client/src/app/(auth)/admin/page.tsx",
    "client/src/app/(auth)/cashier/page.tsx",
    "client/src/app/menu/page.tsx",
    "client/src/components/layout/Navbar.tsx",
    "client/src/components/layout/LoginButton.tsx",
    "client/src/components/layout/Weather.tsx",
    "client/src/components/admin/SalesChart.tsx",
    "client/src/components/admin/Dashboard.tsx",
    "client/src/components/cashier/OrderList.tsx",
    "client/src/components/cashier/Checkout.tsx",
    "client/src/components/menu/MenuGrid.tsx",
    "client/src/lib/api.ts",
    "client/src/types/index.ts"
)

# Create server files
$serverFiles = @(
    "server/.env",
    "server/.gitignore",
    "server/package.json",
    "server/tsconfig.json",
    "server/nodemon.json",
    "server/src/index.ts",
    "server/src/controllers/authController.ts",
    "server/src/controllers/menuController.ts",
    "server/src/controllers/orderController.ts",
    "server/src/models/User.ts",
    "server/src/models/MenuItem.ts",
    "server/src/models/Order.ts",
    "server/src/routes/auth.ts",
    "server/src/routes/menu.ts",
    "server/src/routes/orders.ts",
    "server/src/middleware/auth.ts",
    "server/src/config/db.ts",
    "server/src/config/types.ts"
)

# Create all files
foreach ($file in $clientFiles + $serverFiles) {
    New-Item -ItemType File -Force -Path $file
}

# Create root level files
New-Item -ItemType File -Force -Path "README.md"
New-Item -ItemType File -Force -Path ".gitignore"

# Add content to client .gitignore
$clientGitignore = @"
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
"@

Set-Content -Path "client/.gitignore" -Value $clientGitignore

# Add content to server .gitignore
$serverGitignore = @"
# dependencies
/node_modules

# production
/dist

# misc
.DS_Store

# env files
.env

# logs
*.log
npm-debug.log*

# typescript
*.tsbuildinfo
"@

Set-Content -Path "server/.gitignore" -Value $serverGitignore

# Add content to server .env
$serverEnv = @"
PORT=5000
MONGODB_URI=mongodb://localhost:27017/panda_express_pos
JWT_SECRET=your_secret_key_here
"@

Set-Content -Path "server/.env" -Value $serverEnv

# Add content to client package.json
$clientPackageJson = @"
{
  "name": "panda-express-pos-client",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.15",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.263.1",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
"@

Set-Content -Path "client/package.json" -Value $clientPackageJson

# Add content to server package.json
$serverPackageJson = @"
{
  "name": "panda-express-pos-server",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "mongoose": "^7.0.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/node": "^20.4.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.6"
  }
}
"@

Set-Content -Path "server/package.json" -Value $serverPackageJson

Write-Host "Project structure created successfully!"
Write-Host "Next steps:"
Write-Host "1. CD into client directory and run 'npm install'"
Write-Host "2. CD into server directory and run 'npm install'"
Write-Host "3. Start developing!"