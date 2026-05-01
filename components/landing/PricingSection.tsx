'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Crown, Zap } from 'lucide-react'
import { PLANS } from '@/lib/stripe'

const plans = [
  {
    ...PLANS.FREE,
    popular: false,
    cta: 'Get Started Free',
    ctaHref: '/register',
    priceDisplay: '₹0',
    period: 'forever',
    description: 'Perfect to try the platform',
    highlight: false,
  },
  {
    ...PLANS.PREMIUM_MONTHLY,
    popular: true,
    cta: 'Start 7-Day Free Trial',
    ctaHref: '/register?plan=premium_monthly',
    priceDisplay: '₹149',
    period: '/month',
    description: 'Most popular for serious students',
    highlight: true,
  },
  {
    ...PLANS.PREMIUM_YEARLY,
    popular: false,
    cta: 'Best Value — Save 45%',
    ctaHref: '/register?plan=premium_yearly',
    priceDisplay: '₹999',
    period: '/year',
    description: 'Best value for committed learners',
    highlight: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(212,175,55,0.04)_0%,transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-3">Membership</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Invest in your{' '}
            <span className="gold-text">chess mastery</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            7-day free trial on all plans. No credit card required to start.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border overflow-hidden ${
                plan.highlight
                  ? 'border-[#D4AF37]/40 bg-gradient-to-br from-[#D4AF37]/5 to-[#111118] shadow-gold'
                  : 'border-white/[0.08] bg-[#111118]'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#A8872A]" />
              )}

              {plan.popular && (
                <div className="absolute top-5 right-5">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                    <Crown className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-xs font-bold">MOST POPULAR</span>
                  </div>
                </div>
              )}

              <div className="p-7">
                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-5xl font-black ${plan.highlight ? 'text-[#D4AF37]' : 'text-white'}`}>
                    {plan.priceDisplay}
                  </span>
                  <span className="text-gray-500 text-sm mb-2">{plan.period}</span>
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 mb-7 ${
                    plan.highlight
                      ? 'btn-gold'
                      : 'border border-white/[0.12] text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        plan.highlight ? 'bg-[#D4AF37]/10' : 'bg-emerald-400/10'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? 'text-[#D4AF37]' : 'text-emerald-400'}`} />
                      </div>
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          All plans include 7-day free trial • Cancel anytime • Secure payment via Stripe & Razorpay
        </motion.p>
      </div>
    </section>
  )
}
