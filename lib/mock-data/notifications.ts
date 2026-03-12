import type { Notification } from "@/types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    type: "expiring-credit",
    title: "⚠️ $50 Resy Credit Expires June 30",
    body: "You have $50 in unused Amex Gold Resy dining credits that expire June 30. Book a Resy restaurant this week before you lose it.",
    benefitId: "amex-gold-resy",
    cardId: "amex-gold",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "notif-002",
    type: "expiring-credit",
    title: "🚨 $10 Uber Cash Expires Tonight",
    body: "Your monthly Amex Gold Uber Cash resets tomorrow. Order Uber Eats or take a ride before midnight to claim your $10.",
    benefitId: "amex-gold-uber-cash",
    cardId: "amex-gold",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: "notif-003",
    type: "card-recommendation",
    title: "💡 Use Your Amex Gold at Grocery Stores",
    body: "You've made 8 grocery transactions this month using Chase Freedom Unlimited at 1.5%. Your Amex Gold earns 4x — you missed $18.42 in rewards this month.",
    cardId: "amex-gold",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "notif-004",
    type: "weekly-digest",
    title: "📊 Your Weekly CardIQ Summary",
    body: "This week: $28.50 in benefits captured. $34.80 in potential rewards missed. Your capture rate this month is 42%. Top opportunity: activate your Chase Sapphire Preferred DashPass ($9.99/month value).",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-005",
    type: "category-activation",
    title: "🔔 Activate Chase Freedom Flex Quarterly Categories",
    body: "New quarterly bonus categories are now available — earn 5% on up to $1,500. Activate at chase.com/activate before the deadline.",
    benefitId: "cff-5pct-quarterly",
    cardId: "chase-freedom-flex",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "notif-006",
    type: "expiring-credit",
    title: "📅 $50 Chase Hotel Credit — Use Before Year End",
    body: "Your Chase Sapphire Preferred $50 hotel credit hasn't been used. Book any hotel through Chase Travel before December 31 to capture this benefit.",
    benefitId: "csp-hotel-credit",
    cardId: "chase-sapphire-preferred",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    readAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-007",
    type: "card-recommendation",
    title: "✈️ Use Chase Sapphire Preferred for Flight Bookings",
    body: "You booked 3 flights this quarter using your Amex Gold (3x points on flights). Your Sapphire Preferred earns 5x on Chase Travel — consider booking through chase.com/travel.",
    cardId: "chase-sapphire-preferred",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: "notif-008",
    type: "annual-fee",
    title: "📋 Annual Fee Review: Amex Gold",
    body: "Your Amex Gold $325 annual fee renewed last month. CardIQ analysis: you've captured $198 of $424 in available annual benefits (47% rate). Here's your action plan to flip the ROI positive.",
    cardId: "amex-gold",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    readAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-009",
    type: "weekly-digest",
    title: "📊 Weekly Summary — Feb 24",
    body: "Last week: $45.00 in benefits captured. Your dining spend of $512 all went to Amex Gold (4x) — optimal. Grocery spend of $203 went to Chase Freedom Unlimited — switch to Amex Gold for 4x. Potential additional value: $4.06.",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-010",
    type: "expiring-credit",
    title: "💳 Activate DashPass on Chase Sapphire Preferred",
    body: "Your complimentary DashPass membership ($9.99/month) has never been activated. You've potentially missed 14 months × $9.99 = $139.86 in value. Activate now in the DoorDash app.",
    benefitId: "csp-dashpass",
    cardId: "chase-sapphire-preferred",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
  },
];
