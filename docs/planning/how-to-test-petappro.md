# How to test PetAppro (owner/developer guide)

**Status:** Reference (Cowork, 2026-07-13). For Danny — new to native, iPhone-only. Ties **D-001** (Expo/RN), **D-050** (beta ring / reliability bar), **D-023** (launch).

Testing native isn't scary here — for an iPhone owner it's mostly "scan a QR code." Progression, easiest first:

## 1. Expo Go — day-to-day loop (free, instant)
PetAppro is built on Expo. During development, install the free **Expo Go** app from the App Store. When the project is running it shows a **QR code** — scan it with your iPhone camera and PetAppro opens live in Expo Go, **hot-reloading** as changes are made. No build, no Apple account; works over Wi-Fi (or a tunnel if remote). Covers ~90% of early testing.

## 2. Dev build — when a feature exceeds Expo Go (free)
Some native modules (certain payment / camera / notification / **GPS** libraries) go beyond Expo Go. Then **EAS** (Expo's build service) makes a **custom dev build** you install on your iPhone once via a link — after that it behaves just like Expo Go but supports everything. Free tier is fine; a **free** Apple account installs on your own device. This is where GPS/location, Stripe, and push-notification testing happen.

## 3. TestFlight — real beta, closest to production
Near launch, EAS builds the actual iOS app and pushes it to **TestFlight** (Apple's official beta app). You install the real app and can invite other testers — this is our **beta ring** (your own business → 5–6 PCSPs, per D-050). This step needs the **Apple Developer account ($99/yr)** — which you need for the App Store anyway (pending BIZ enrollment task). Not needed until later.

## Android — you don't need to own one
The app is iOS **and** Android from the start (one Expo codebase, D-001). You personally test on iPhone; Android is covered by an **emulator** on the computer, **CI checks**, and **one Android tester** (or a cheap used device) before launch. Missing an Android phone won't block you.

## Cost / effort ramp (gentle)
| Stage | When | Cost |
|---|---|---|
| Expo Go (QR-code testing) | now, day-to-day | free |
| EAS dev build (GPS/payments/push) | mid-build | free tier + free Apple account |
| TestFlight beta + App Store | near launch | **Apple Developer $99/yr** |
| Google Play (Android publish) | near launch | **$25 one-time** |

You'll be tapping through PetAppro on your own iPhone **very early** — well before any paid or store steps.
