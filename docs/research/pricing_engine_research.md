# Pricing Engine Research & Recommendation

## Purpose

This document summarizes pricing research across multiple service
industries to guide the design of a single configurable pricing engine
for Petappro.

**Conclusion:** A single configurable pricing engine can support all
researched verticals. The differences are almost entirely configuration,
not fundamentally different pricing logic.

------------------------------------------------------------------------

# Supported Verticals

1.  Dog Boarding
2.  Dog Daycare
3.  Dog Walking
4.  Pet Sitting (Drop-in / Overnight)
5.  Dog Training
6.  Hair Salons
7.  Massage Therapy

------------------------------------------------------------------------

# Comparison Summary

  ----------------------------------------------------------------------------------------------------------
  Vertical   Primary     Scaling   Common        Time          Packages        Staff        Policies
             Unit                  Add-ons       Surcharges                    Pricing      
  ---------- ----------- --------- ------------- ------------- --------------- ------------ ----------------
  Dog        Night       Extra     Bath, meds,   Holiday, peak Long-stay       Rare         Deposits,
  Boarding               pets      hikes         season        discounts                    cancellation

  Dog        Day / Half  Extra     Grooming,     Holidays      Day packs,      Rare         Cancellation
  Daycare    Day         dogs      enrichment                  memberships                  

  Dog        Duration    Extra     Feeding, meds Weekend,      Weekly plans    Occasional   Short
  Walking                dogs                    evening,                                   cancellation
                                                 holidays                                   

  Pet        Visit /     Extra     Medication,   Holiday,      Visit bundles   Rare         Deposits
  Sitting    Overnight   pets      plant care    after-hours                                

  Dog        Session /   Per dog / Equipment     Weekend       Multi-session   Common       Non-refundable
  Training   Course      family                  classes       packages                     packages

  Hair Salon Service     Per       Toner,        After-hours   Memberships     Very common  Deposits,
                         client    treatments,                                              no-show
                                   color                                                    

  Massage    Duration    Per       Hot stones,   Weekend,      Memberships     Common       Deposits,
                         client    CBD           evening                                    cancellation
  ----------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# Shared Pricing Backbone

Every vertical can be modeled using the same pricing flow:

1.  Base Rate
2.  Quantity
3.  Participant Adjustments
4.  Conditional Modifiers
5.  Optional Add-ons
6.  Discounts
7.  Taxes / Fees
8.  Deposit Calculation
9.  Final Total

------------------------------------------------------------------------

# Recommended Pricing Primitives

## 1. Base Rate

Defines the starting price.

Examples:

-   Flat
-   Per Night
-   Per Visit
-   Per Session
-   Per Hour
-   Per Day

------------------------------------------------------------------------

## 2. Unit Type

Recommended enum:

-   Per Service
-   Per Session
-   Per Visit
-   Per Hour
-   Per Day
-   Per Night
-   Per Week
-   Per Month
-   Per Participant

------------------------------------------------------------------------

## 3. Quantity

Supports multiplication by:

-   Nights
-   Visits
-   Sessions
-   Hours
-   Days
-   Participants

------------------------------------------------------------------------

## 4. Conditional Modifiers

Rule-based pricing.

Examples:

-   Holiday
-   Weekend
-   Peak Season
-   Senior Staff
-   Large Dog
-   Long Hair
-   Travel Radius
-   After Hours

Support:

-   Fixed amount
-   Percentage
-   Stackable rules
-   Priority/order

------------------------------------------------------------------------

## 5. Participant Rules

Supports:

-   Included participants
-   Additional participant fee
-   Maximum participants
-   Group pricing
-   Family pricing

Applies equally to pets or people.

------------------------------------------------------------------------

## 6. Add-ons

Independent catalog.

Fields:

-   Name
-   Price
-   Quantity
-   Required / Optional
-   Staff selectable
-   Client selectable

Examples:

-   Bath
-   Medication
-   Hot Stones
-   Toner
-   Nail Trim
-   Pickup

------------------------------------------------------------------------

## 7. Discounts

Supports:

-   Percentage
-   Fixed amount
-   Coupon
-   Membership
-   Package
-   Recurring booking
-   Multi-pet
-   Long stay

------------------------------------------------------------------------

# Supporting Configuration

These are configuration layers rather than pricing primitives.

-   Rate Books
-   Staff-specific Overrides
-   Effective Dates
-   Minimum Charges
-   Maximum Caps
-   Taxes
-   Deposits
-   Cancellation Policies
-   Refund Rules

------------------------------------------------------------------------

# Industry Outliers

## Hair Salons

Material consumption:

-   Extra bowls of color
-   Long hair surcharge

Treat as configurable modifiers.

## Dog Training

Course pricing.

Represent as package pricing rather than requiring custom logic.

## Dog Boarding

Seasonal calendar pricing.

Represent with date-based conditional modifiers.

## Massage

Insurance billing is a billing workflow concern, not a pricing engine
concern.

------------------------------------------------------------------------

# Architecture Recommendation

Implement a single pricing engine that follows this pipeline:

    Base Rate
        ↓
    Quantity
        ↓
    Participant Adjustments
        ↓
    Conditional Modifiers
        ↓
    Add-ons
        ↓
    Discounts / Credits
        ↓
    Taxes & Fees
        ↓
    Deposit Calculation
        ↓
    Final Total

Each vertical should configure the engine rather than introducing
bespoke pricing code.

This approach supports future expansion into additional
appointment-based service industries while keeping pricing logic
centralized, maintainable, and extensible.
