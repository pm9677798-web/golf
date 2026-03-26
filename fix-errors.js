#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Golf Charity Platform errors...\n');

// 1. Fix package.json dependencies
console.log('1. Updating package.json...');
const packageJson = {
  "name": "golf-charity-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "typescript": "5.3.0",
    "@types/node": "20.10.0",
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.0",
    "tailwindcss": "3.4.0",
    "autoprefixer": "10.4.0",
    "postcss": "8.4.0",
    "eslint": "8.55.0",
    "eslint-config-next": "14.1.0"
  }
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ package.json updated');

// 2. Create a simple next.config.js
console.log('2. Creating next.config.js...');
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
}

module.exports = nextConfig`;

fs.writeFileSync('next.config.js', nextConfig);
console.log('✅ next.config.js created');

// 3. Create a simple tsconfig.json
console.log('3. Creating tsconfig.json...');
const tsConfig = {
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
};

fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2));
console.log('✅ tsconfig.json created');

// 4. Create next-env.d.ts
console.log('4. Creating next-env.d.ts...');
const nextEnv = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.`;

fs.writeFileSync('next-env.d.ts', nextEnv);
console.log('✅ next-env.d.ts created');

// 5. Create a simple .env.local template
console.log('5. Creating .env.local template...');
const envTemplate = `# Copy this to .env.local and fill in your values

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# JWT
JWT_SECRET=your_jwt_secret_here

# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here`;

fs.writeFileSync('.env.local.template', envTemplate);
console.log('✅ .env.local template created');

console.log('\n🎉 Basic fixes applied!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Copy .env.local.template to .env.local and fill in your values');
console.log('3. Set up your Supabase database using database/schema.sql');
console.log('4. Run: npm run dev');
console.log('\n✨ Your Golf Charity Platform should work after these steps!');