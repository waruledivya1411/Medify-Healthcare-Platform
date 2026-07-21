# Medify — Healthcare Platform

Medify is a **web-based healthcare platform** that brings together online pharmacy, doctor consultations, lab test bookings, health insurance exploration, video consultation, and role-based staff dashboards in one place.

Built with **HTML, CSS, and JavaScript**, and powered by **Google Firebase** (Authentication, Firestore, Storage).

---

## Features

### For patients / customers
- **Online pharmacy** — browse medicines, search, category filters, cart, checkout
- **Prescription upload** — JPG / PNG / PDF (max 5MB) to Firebase Storage
- **Doctor consultations** — specialties, filters (mode, experience, fees, language), appointment requests
- **Video consultation** — join remote consult sessions
- **Lab tests** — packages and individual tests, booking flow
- **Health insurance** — compare and explore plans
- **Auth** — signup / login as Customer
- **Notifications** — appointment / booking related updates (Firestore)

### For staff (separate login sessions per role)
| Role | Dashboard | Purpose |
|------|-----------|---------|
| **Doctor** | `doctor-dashboard.html` | Appointments, patient history, schedule |
| **Pharmacist** | `pharmacist-dashboard.html` | Prescriptions, orders, dispense |
| **Delivery** | `delivery-dashboard.html` | Out-for-delivery / delivered orders |
| **Clinic** | `clinic-dashboard.html` | Lab bookings, patient records |

Each staff role uses its **own Firebase Auth instance**, so logging in as pharmacist does not log out doctor (or customer).

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Icons | Font Awesome 6 (CDN) |
| Backend services | Firebase Authentication, Cloud Firestore, Cloud Storage |
| Security | Firestore rules + Storage rules |
| Hosting | Static hosting (any static host / Firebase Hosting / local server) |

No React / Node / Express required for the current version — Firebase acts as the backend (BaaS).

---

## Project structure

```
Medify/
├── index.html                 # Home / landing
├── medicines.html             # Pharmacy
├── consultation.html          # Specialties
├── doctors.html               # Doctor listing + filters
├── labtest.html               # Lab tests overview
├── labtests-list.html         # Lab tests listing + booking
├── insurance.html             # Insurance plans
├── checkout.html              # Cart checkout
├── signup.html                # Customer signup
├── video-call.html            # Video consultation
│
├── doctor-dashboard.html      # Doctor portal
├── pharmacist-dashboard.html  # Pharmacist portal
├── delivery-dashboard.html    # Delivery portal
├── clinic-dashboard.html      # Clinic / lab portal
│
├── create-doctor-account.html
├── create-pharmacist-account.html
├── create-delivery-account.html
├── create-clinic-account.html
│
├── styles.css
├── script.js / script-v2.js   # Main UI + login / cart / notifications
├── doctors.js
├── medicines-data.js
├── labtests-data.js
├── firebase-config.js         # Firebase init (customer + per-role apps)
├── firestore.rules
├── storage.rules
├── images/
├── architecture.md            # System architecture
└── README.md
```

---

## Getting started

### Prerequisites
- Modern browser (Chrome, Edge, Firefox, Safari)
- Firebase project configured (already wired in `firebase-config.js`)
- For local auth: add `localhost` and `127.0.0.1` under  
  **Firebase Console → Authentication → Settings → Authorized domains**

### Run locally

```bash
# From project folder
python -m http.server 3000
```

Then open: [http://localhost:3000](http://localhost:3000)

Or use any static server (`npx serve`, Live Server, etc.). Opening files via `file://` may break Firebase / CORS.

### Demo staff accounts (test helpers)
Use the create-account pages if needed, then login from the home page with the matching role:

| Role | Typical email |
|------|----------------|
| Doctor | `doctor@medify.com` |
| Pharmacist | `pharmacist@medify.com` |
| Delivery | `delivery@medify.com` |
| Clinic | `clinic@medify.com` |

---

## How it works (short)

1. Browser loads HTML / CSS / JS (static frontend).
2. User actions call the **Firebase SDK** over **HTTPS**.
3. **Firebase Auth** handles login (customer app vs role-specific apps).
4. **Firestore** stores users, orders, appointments, prescriptions metadata, lab bookings, notifications, patients.
5. **Storage** holds prescription / signup files.
6. **Security rules** enforce access on the server side.

See **[architecture.md](./architecture.md)** for diagrams, data model, and role isolation.

---

## Main Firestore collections

| Collection | Used for |
|------------|----------|
| `users` | Customer profiles |
| `doctors` | Doctor listing / profiles |
| `appointment_requests` | Consultation requests |
| `notifications` | Patient notifications |
| `orders` | Pharmacy orders |
| `prescriptions` | Prescription upload metadata |
| `lab_bookings` | Lab test bookings |
| `patients` | Patient history (doctor / clinic) |

---

## Security notes

- Firebase web config in the frontend is **expected to be public**.
- Real protection comes from **Auth + Firestore / Storage rules**.
- Do not rely on client-side checks alone for access control.

---

## Future enhancements

- Payment gateway (UPI / cards)
- Full appointment calendar + reminders
- Push notifications (FCM)
- Multilingual UI
- PWA / offline shell
- Native mobile apps sharing the same Firebase backend
- Stronger compliance (audit logs, consent)

---

## Contact

- **Phone:** +91 9822961688  
- **Email:** support@medify.com  
- **Address:** Vivekanandnagar, Kopargaon, Maharashtra, India  

---

## License

© Medify. All rights reserved.

**Medify** — Your trusted healthcare partner.
