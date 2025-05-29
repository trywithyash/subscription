import Stripe from "stripe";


export const stripe=new Stripe(envConfig.STRIPE_SECRET_KEY,{
    
})