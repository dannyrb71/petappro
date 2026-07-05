# PetAppro Platform, Notifications, and Activity History Plan

## Product Direction

Build PetAppro as one shared multi-tenant platform, not as separate white-label apps for every customer.

Each pet care business should be able to configure its own version through:

- Business name and logo/text-logo
- Services offered
- Pricing and pricing rules
- Policies and terms
- Staff access
- Client access
- Notification preferences
- Optional paid add-ons

Clients and staff should enter an invite code during onboarding. The code connects them to the correct business account and determines whether they are a client, staff member, partner, or owner.

Recommended database model: one shared database with strong tenant separation using `business_id` or `tenant_id` across business-specific records.

Avoid separate databases per customer for the MVP. Separate databases would make migrations, debugging, analytics, support, and feature rollout more complex.

## Activity History Tool

Add an activity history tool to each user profile.

Purpose:

- Show archived/past booking activity.
- Include completed and cancelled bookings from the database.
- Do not include active or upcoming bookings, because those should continue to appear in the main dashboard.

UI concept:

- Add an activity/date picker section to the user profile.
- Highlight dates that contain completed or cancelled booking activity.
- When a highlighted date is selected, open a modal overlay.
- The modal should show reservation card(s) for that date.

Reservation card should include:

- Service type tag, such as `Boarding`, `Daycare`, `Dog Walking`, `Grooming`, etc.
- Status tag: `Completed` or `Cancelled`.
- Pet(s) included in the booking.
- Booking date(s) and time(s), if applicable.
- Total booking amount.
- Fee breakdown, using existing booking/pricing fields where available.
- Any relevant booking details already shown in existing booking cards.

Implementation notes for Claude/Claude Code:

- Reuse existing booking card styling and data shape where possible.
- Query only historical bookings with statuses equivalent to completed or cancelled.
- Keep dashboard behavior unchanged for active and upcoming bookings.
- Date picker should visually indicate dates with activity.
- If multiple historical bookings exist on one date, show all matching reservation cards in the modal.
- Empty state: if a selected date has no activity, show a simple "No activity for this date" message.

## Notifications Strategy

Email should be used for paper-trail communication, not urgent alerts.

Good uses for email:

- Receipts
- Invoices
- Terms/policy acceptance records
- Account recovery
- Official booking confirmation copies
- Cancellation records

Avoid relying on email for:

- New booking alerts
- Urgent staff notifications
- New message alerts
- Time-sensitive pickup/drop-off reminders

## Mobile Notification Options for Web App

A web app cannot silently send a text message from a user's native Messages app. It can open the native SMS composer with a prefilled message, but the user must still tap send.

For automatic SMS alerts, the app backend needs an SMS provider such as Twilio.

Recommended alert architecture:

1. App event happens, such as booking requested, booking cancelled, or message sent.
2. Save event to an internal `notifications` table.
3. Deliver through enabled channels:
   - In-app notification center
   - SMS, if enabled
   - Push/web push, if supported and opted in
   - Email only when a paper trail is needed

Web push can work for some users, but it is less reliable and more conditional than native push. iOS support requires the web app to be added to the Home Screen and the user must grant permission.

Because reliable mobile alerts are critical to the product, native app support should be seriously considered.

## Messaging Roadmap

MVP:

- Include a "Send Message" button that opens the user's native messaging tool where appropriate.
- Keep official booking updates and activity records inside the app.

Paid add-on:

- Add in-app messaging powered by Twilio or a similar provider.
- Support staff-to-client messaging inside the app.
- Optionally support SMS fallback/bridging.
- Charge as an add-on because SMS and messaging infrastructure create ongoing usage costs.

Possible packaging:

- Base plan: booking, dashboard, client portal, activity history, email paper trail.
- Pro plan or add-on: SMS alerts/reminders.
- Premium add-on: in-app messaging/SMS bridge.

## Payment Strategy

Client payments for pet care services should be treated as payments for real-world services consumed outside the app.

Recommended approach:

- Use Stripe Connect or a similar marketplace/platform payment system.
- Each pet care business should connect its own payment account.
- The client pays the business for boarding, daycare, walking, grooming, etc.
- PetAppro can optionally collect a platform fee or processing/service fee if the pricing model requires it.
- Payment status should sync back into the booking automatically through payment webhooks.

Preferred payment flow:

1. Client books a service.
2. App creates a booking with `payment_status = unpaid` or `deposit_due`.
3. App creates a Stripe Checkout/payment link or embedded payment session for that booking.
4. Client pays with card, Apple Pay, Google Pay, or another supported payment method.
5. Payment provider sends webhook back to PetAppro.
6. Booking updates to `paid`, `deposit_paid`, `partially_paid`, or `failed`.
7. Receipt/paper-trail email is sent if enabled.

Avoid using Apple/Google in-app purchases for client payments for pet care services. In-app purchase systems are intended for digital goods, app features, subscriptions, and digital content. Real-world services should use external payment methods such as credit card, Apple Pay, Google Pay, or payment provider checkout.

Manual/offline payment support:

- Allow staff/admin to mark a booking as paid manually.
- Track payment method as `cash`, `check`, `venmo`, `zelle`, `external`, or `other`.
- Require an optional note/reference field when manually marking paid.
- Show manual payments clearly in the booking history and activity history.

Venmo/Zelle/Cash App style links:

- Can be supported as a lightweight external/manual option.
- Best for MVP or very small providers.
- Less reliable because payment confirmation may not return automatically.
- The app should not assume payment succeeded unless a webhook confirms it or staff marks it as paid.

Recommended MVP:

- Add manual payment tracking first if needed.
- Add Stripe Connect for professional payment collection.
- Defer Venmo-style integrations unless small providers specifically ask for them.

Payment method offering:

- Offer one primary payment system: Stripe.
- Do not build separate first-class integrations for PayPal, Venmo, Zelle, Apple Pay, Google Pay, and cards individually.
- Use Stripe to present supported payment methods such as credit/debit card, Apple Pay, Google Pay, Link by Stripe, and other eligible wallet/payment options based on device, region, browser, and connected account settings.
- Treat PayPal as a possible later addition only if it works cleanly inside the Stripe/Connect setup.
- Keep Venmo, Zelle, cash, check, and other off-platform payments as manual tracking options.
- For manual/offline payments, staff/admin can mark a booking as paid and optionally record method, note/reference, amount, and date.

Suggested customer-facing language:

> Enable online payments with Stripe. Clients can pay by card and supported digital wallets such as Apple Pay and Google Pay.

> Track offline payments such as cash, check, Venmo, or Zelle.

Stripe Connect add-on recommendation:

- Offer payment collection as an optional add-on or as part of a Pro plan.
- Use Stripe-hosted onboarding or embedded onboarding so Stripe collects business, identity, bank, and tax details from each subscriber.
- Store each business's Stripe connected account ID on the `businesses` table.
- Use Stripe Checkout or Payment Intents for booking payments.
- Use Stripe webhooks to update booking payment status automatically.
- Prefer a model where the connected business account pays Stripe processing fees directly, especially early on.
- Avoid becoming responsible for fee collection, losses, and 1099 handling unless the business model intentionally requires it.
- Position PetAppro as a SaaS provider, not as the employer, broker, agency, or marketplace operator for the pet care business.
- Do not take responsibility for provider-client service delivery, worker classification, employment, taxes, insurance, service quality, refunds outside platform rules, or client/provider disputes beyond reasonable software support.
- The pet care business should remain the merchant/service provider of record for its own clients wherever possible.

Suggested pricing:

- MVP/simple: include Stripe payments in a Pro plan or charge $10-$15/month as a payments add-on.
- Avoid adding a PetAppro processing markup at launch.
- Let Stripe processing fees pass directly to the connected business account.
- Consider monetizing through monthly SaaS subscriptions and optional add-ons instead of transaction fees.

1099/tax reporting note:

- Stripe can handle some 1099-K reporting for connected accounts depending on the Connect configuration, especially where the connected account pays Stripe fees directly or Stripe controls the pricing.
- If PetAppro controls payment pricing or pays Stripe fees as the platform, PetAppro may become responsible for filing relevant 1099 forms.
- Confirm final tax reporting structure with a CPA before launch.

## Native App Direction

Given the importance of dependable mobile alerts, a native app or React Native/Expo app may be the stronger direction for launch.

Recommended approach:

- Keep the admin/business setup interface web-based.
- Build the client/staff mobile experience as a native or React Native/Expo app.
- Use one app with invite codes rather than separate app-store builds for every business.
- The invite code maps each user to the correct business configuration.

This avoids the operational and app-store risk of generating many nearly identical white-label apps, while still letting each business offer a customized experience to staff and clients.

October launch feasibility:

- A focused MVP could be possible in roughly 3 months if scope is tightly controlled.
- Native app + web admin + multi-tenant setup + notifications + payments + messaging is too much for a first October release unless features are phased.

Suggested October MVP:

- Web admin for business setup
- One shared mobile app or responsive client/staff app
- Invite-code onboarding
- Business profile branding
- Core booking flows
- Staff dashboard
- Client dashboard
- Historical activity/date picker
- In-app notification center
- SMS alerts for owners/staff using backend provider
- Email only for paper-trail items

Defer until after launch:

- Full in-app messaging
- SMS conversation bridge
- Multiple business verticals outside pet care
- Fully custom app-store builds per business
- Advanced staff permissions
- Native-only enhancements that are not needed for booking flow
