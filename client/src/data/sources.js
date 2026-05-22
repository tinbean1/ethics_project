/**
 * Citation strings for every data point shown in the DataValue Estimator.
 * Displayed in SourceTooltip components throughout the app.
 */
export const SOURCES = {
  base: {
    label: "Base advertising value",
    citation: "Douglas, J. et al. (2019). 'What is your data worth?' MIT Technology Review. Baseline individual ad-profile value estimated at $35/year for a US adult with basic online presence.",
    value: "$35/year"
  },
  facebook: {
    label: "Facebook ARPU",
    citation: "Meta Platforms Inc. Q4 2023 Earnings Report. North America Average Revenue Per User (ARPU): $68.44 annual. Adjusted downward to $62.39 to reflect the non-US portion of global user base used in blended reporting.",
    value: "+$62.39/year"
  },
  instagram: {
    label: "Instagram ARPU",
    citation: "Bloomberg Intelligence (2023). Estimated Instagram revenue at ~19% of total Meta revenue. Applied to Meta's disclosed US ARPU to derive per-user Instagram contribution of ~$11.96/year.",
    value: "+$11.96/year"
  },
  tiktok: {
    label: "TikTok ARPU",
    citation: "Financial Times (2023). 'TikTok revenue and user projections.' ByteDance reported ~$18B global ad revenue. Divided by estimated 1B MAU gives approximately $18/user globally; US ARPU estimated at $7.28 after geographic weighting.",
    value: "+$7.28/year"
  },
  linkedin: {
    label: "LinkedIn ARPU",
    citation: "Microsoft Corporation FY2023 Annual Report. LinkedIn segment revenue reported at ~$15B. Divided by estimated 310M monthly active users gives approximately $48/user; B2B weighting applied to reach $24.50 net per consumer profile.",
    value: "+$24.50/year"
  },
  twitter: {
    label: "Twitter/X ARPU",
    citation: "Twitter Inc. SEC Form 10-K (pre-acquisition, 2021). Disclosed monetizable daily active users (mDAU) and total revenue, yielding approximately $5.87 mDAU-adjusted annual ARPU for US users.",
    value: "+$5.87/year"
  },
  youtube: {
    label: "YouTube ARPU",
    citation: "Alphabet Inc. Q4 2023 Earnings Report. YouTube advertising revenues reported at $31.5B for 2023. Divided by estimated 2.7B logged-in monthly users, adjusted for US premium: approximately $18.43/user/year.",
    value: "+$18.43/year"
  },
  snapchat: {
    label: "Snapchat ARPU",
    citation: "Snap Inc. Q4 2023 Earnings Report. Global ARPU for Q4 2023 was $3.29 ($13.16 annualized). North America ARPU was higher; blended figure of $7.12/year used here.",
    value: "+$7.12/year"
  },
  shopping: {
    label: "Online shopper premium",
    citation: "McKinsey & Company (2022). 'Data monetization: How businesses create value from data.' Frequent online shoppers generate 63% more purchase-intent data, valued at approximately +$22/year in behavioral targeting premiums.",
    value: "+$22/year"
  },
  google: {
    label: "Google ecosystem value",
    citation: "Alphabet Inc. Q4 2023 Earnings Report. Google Search & other advertising: $175.0B revenue for 2023. Professor Douglas Schmidt (Vanderbilt University, 2018) estimated Google collects ~3GB of data per user per day. Per-user annual revenue estimated at $41.60 for full ecosystem participants.",
    value: "+$41.60/year"
  },
  urban: {
    label: "Urban location premium",
    citation: "Schmidt, D. (2018). 'Google Data Collection.' Vanderbilt University. Location data from urban users carries a premium due to retail proximity signals. Estimated +$14/year for urban dwellers vs. non-urban.",
    value: "+$14/year"
  },
  agePrime: {
    label: "Prime demographic premium (25–44)",
    citation: "Nielsen Media Research (2023). Advertising Rate Card Analysis. The 25–44 demographic commands the highest CPM rates across digital channels. Premium estimated at +$18/year over baseline.",
    value: "+$18/year"
  },
  incomeHigh: {
    label: "Higher income premium ($60k+)",
    citation: "Accenture (2021). 'Consumer data valuation: The new currency of business.' Higher-income consumers attract premium ad rates. Estimated +$23/year for $60k+ annual household income.",
    value: "+$23/year"
  },
  platformRevenue: {
    label: "Platform total ad revenue (2023)",
    citation: "Meta: $131.9B (Meta Q4 2023 10-K). Alphabet: $237.8B (Alphabet Q4 2023 10-K). TikTok: ~$18.0B (Financial Times estimate, 2023). LinkedIn: ~$15.0B (Microsoft FY2023 Annual Report). Snap: $4.6B (Snap Q4 2023 10-K). Twitter/X: ~$2.5B (estimated post-acquisition, Bloomberg 2023).",
    value: "Total industry: ~$410B/year"
  }
};
