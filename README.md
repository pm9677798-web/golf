# Golf Charity Subscription Platform

A comprehensive subscription-based golf platform combining performance tracking, monthly prize draws, and charitable giving. Built for the Digital Heroes trainee selection process.

## 🏆 Features

### Core Functionality
- **Subscription System**: Monthly and yearly plans with Stripe integration
- **Golf Score Tracking**: Stableford format (1-45), rolling 5-score system
- **Monthly Draw Engine**: Random and algorithmic draw systems
- **Charity Integration**: Minimum 10% contribution, user-selectable charities
- **Winner Verification**: Screenshot upload and admin approval system
- **Prize Pool Logic**: Automatic distribution (40% 5-match, 35% 4-match, 25% 3-match)

### User Roles
- **Public Visitors**: Browse platform, view charities, understand mechanics
- **Registered Subscribers**: Score entry, charity selection, prize participation
- **Administrators**: User management, draw execution, winner verification

### Technical Features
- **Modern UI/UX**: Emotion-driven design, avoiding traditional golf aesthetics
- **Mobile-First**: Fully responsive design
- **Real-time Updates**: Live subscription status validation
- **Secure Authentication**: JWT-based with bcrypt password hashing
- **Database**: PostgreSQL with Supabase, comprehensive RLS policies

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Stripe account
- Vercel account (for deployment)

### 1. Clone and Install
```bash
git clone <repository-url>
cd golf-charity-platform
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JWT
JWT_SECRET=your_secure_random_string

# Email (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
3. This will create all tables, indexes, RLS policies, and sample data

### 4. Stripe Setup
1. Create products in Stripe Dashboard:
   - Monthly Plan: $29.99/month
   - Yearly Plan: $299.99/year
2. Copy the price IDs to your environment variables
3. Set up webhook endpoint: `your-domain.com/api/webhooks/stripe`

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🧪 Testing

### Demo Accounts
The database includes pre-configured demo accounts:

**Regular User:**
- Email: `demo@golfheart.com`
- Password: `password123`

**Admin User:**
- Email: `admin@golfheart.com`
- Password: `admin123`

### Test Flow
1. **User Registration**: Sign up with new account
2. **Score Entry**: Add 5 golf scores (1-45 range)
3. **Draw Participation**: Scores automatically enter monthly draws
4. **Admin Functions**: Use admin account to run draws and verify winners
5. **Charity Selection**: Choose from pre-loaded charities

## 📁 Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── user/          # User-specific endpoints
│   │   ├── admin/         # Admin-only endpoints
│   │   └── charities/     # Charity management
│   ├── dashboard/         # User dashboard
│   ├── admin/            # Admin dashboard
│   ├── charities/        # Charity listing page
│   ├── login/            # Authentication pages
│   └── signup/
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Database client
│   ├── stripe.ts         # Payment processing
│   ├── auth.ts           # Authentication utilities
│   └── draw-engine.ts    # Draw logic and algorithms
├── database/             # Database schema and migrations
└── components/           # Reusable React components
```

## 🎯 Key Implementation Details

### Score Management
- **Rolling System**: Only latest 5 scores retained
- **Validation**: Stableford range (1-45) enforced
- **Chronological Display**: Most recent first
- **Auto-replacement**: New scores replace oldest automatically

### Draw Engine
- **Random Mode**: Standard lottery-style number generation
- **Algorithmic Mode**: Weighted by least frequent user scores
- **Prize Distribution**: Fixed percentages with rollover logic
- **Winner Detection**: Automatic matching and prize calculation

### Subscription Logic
- **Real-time Validation**: Status checked on every authenticated request
- **Automatic Expiry**: Expired subscriptions marked inactive
- **Stripe Integration**: Webhooks handle subscription lifecycle
- **Charity Contributions**: Automatic percentage-based donations

### Admin Features
- **Draw Management**: Run simulations before publishing
- **User Management**: View, edit, manage all user accounts
- **Winner Verification**: Approve/reject with screenshot review
- **Analytics**: Comprehensive reporting and statistics

## 🔒 Security Features

- **Row Level Security**: Supabase RLS policies protect user data
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive server-side validation
- **HTTPS Enforcement**: SSL/TLS required for all requests

## 🚀 Deployment

### Vercel Deployment
1. Create new Vercel project
2. Connect to your repository
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Supabase Configuration
1. Create new Supabase project
2. Run database schema
3. Configure RLS policies
4. Set up authentication providers if needed

### Stripe Configuration
1. Set up webhook endpoints
2. Configure product catalog
3. Test payment flows
4. Enable live mode for production

## 📊 Database Schema

### Core Tables
- **users**: User accounts and subscription data
- **golf_scores**: Score tracking with date validation
- **charities**: Charity directory with featured status
- **draws**: Monthly draw results and configuration
- **draw_entries**: User participation in draws
- **winners**: Prize winners with verification status
- **charity_contributions**: Donation tracking

### Key Relationships
- Users → Golf Scores (1:many)
- Users → Charity Contributions (1:many)
- Draws → Draw Entries (1:many)
- Draw Entries → Winners (1:1)
- Charities → Users (1:many via selected_charity_id)

## 🎨 UI/UX Design Principles

### Modern Golf Platform
- **Emotion-Driven**: Focus on charitable impact over sport
- **Clean Aesthetics**: Avoid traditional golf clichés
- **Motion Enhanced**: Subtle animations and micro-interactions
- **Mobile-First**: Responsive design for all devices

### Color Palette
- **Primary**: Blue gradient for platform branding
- **Charity**: Purple gradient for charitable elements
- **Success**: Green for positive actions
- **Warning**: Yellow for attention items
- **Error**: Red for validation and errors

## 🔧 Customization

### Adding New Charities
```sql
INSERT INTO charities (name, description, image_url, is_featured) 
VALUES ('Charity Name', 'Description', 'image_url', false);
```

### Modifying Prize Distribution
Update percentages in `lib/draw-engine.ts`:
```typescript
const fiveMatchPool = currentPool * 0.4  // 40%
const fourMatchPool = currentPool * 0.35 // 35%
const threeMatchPool = currentPool * 0.25 // 25%
```

### Subscription Plans
Modify plans in `lib/stripe.ts` and update Stripe dashboard accordingly.

## 📈 Analytics & Reporting

### Admin Dashboard Metrics
- Total users and active subscribers
- Prize pool calculations
- Charity contribution totals
- Draw statistics and winner counts
- User engagement metrics

### User Dashboard Features
- Personal score tracking
- Participation history
- Charity impact visualization
- Winning history and verification status

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Verify Supabase credentials
2. **Stripe Webhooks**: Check endpoint configuration
3. **Authentication**: Ensure JWT secret is set
4. **Score Validation**: Confirm 1-45 range enforcement
5. **Draw Logic**: Verify user has 5 scores for participation

### Debug Mode
Set `NODE_ENV=development` for detailed error logging.

## 📝 License

This project is created for the Digital Heroes trainee selection process. All rights reserved.

## 🤝 Support

For technical support or questions about implementation, please contact the development team.

---

**Built with ❤️ for golfers who want to make a difference**