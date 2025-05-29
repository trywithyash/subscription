
import 'dotenv/config';

const envConfig = {
    MONGODB_URL:process.env.MONGODB_URL|| '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  STRIPE_PRICE_MONTHLY: process.env.STRIPE_PRICE_MONTHLY || '',
  STRIPE_PRICE_SIX_MONTH: process.env.STRIPE_PRICE_SIX_MONTH || '',
  STRIPE_PRICE_YEARLY: process.env.STRIPE_PRICE_YEARLY || '',
}


export default envConfig;