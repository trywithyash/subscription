import envConfig from "@/config/env";
import Stripe from "stripe";


 const stripe=new Stripe(envConfig.STRIPE_SECRET_KEY!,{
   apiVersion:'2025-04-30.basil'
})

export default stripe;