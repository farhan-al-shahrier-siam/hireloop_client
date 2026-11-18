import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
    "seeker_pro":"price_1UcyLq2zU8fRV1xixWqrff9M",
    "seeker_premium":"price_1UczBB2zU8fRV1xihk2VVdB3",
    "recruiter_growth":"price_1UczCg2zU8fRV1xiglTYC9zW",
    "recruiter_enterprise":"price_1UczDU2zU8fRV1xiAkIXZkkf",
}