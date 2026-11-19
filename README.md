<h1 align="center">Bank System — Front-end</h1>

<p align="center">
  A mobile-first React single-page app for a bank back office:<br />
  clients, deposits, withdrawals and transfers, currency exchange, audit logs, and per-user permissions.
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white" />
  <img alt="React Router" src="https://img.shields.io/badge/React_Router-7-ca4245?logo=reactrouter&logoColor=white" />
  <img alt="Axios" src="https://img.shields.io/badge/Axios-1.x-5a29e4?logo=axios&logoColor=white" />
  <img alt="Responsive" src="https://img.shields.io/badge/Design-mobile--first-191c1f" />
</p>

<table align="center">
  <tr>
    <td align="center"><img src="docs/screenshots/desktop/03-home.png" alt="Home screen on desktop" width="640" /></td>
    <td align="center"><img src="docs/screenshots/mobile/03-home.png" alt="Home screen on a phone" width="230" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Desktop</sub></td>
    <td align="center"><sub>Phone</sub></td>
  </tr>
</table>

> **About the screenshots.** Every image in this document was taken from the running app with the
> API replaced by **made-up sample data** (names, accounts and balances are fictional), so no real
> data is shown and nothing was written to a database.

---

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tour of the screens](#tour-of-the-screens)
4. [Permissions and access control](#permissions-and-access-control)
5. [Design and responsiveness](#design-and-responsiveness)
6. [Tech stack](#tech-stack)
7. [Getting started](#getting-started)
8. [Talking to the API](#talking-to-the-api)
9. [Project structure](#project-structure)
10. [Quality and known limitations](#quality-and-known-limitations)

---

## Overview

This is the user interface of a small banking back-office system. Bank employees sign in, and what they
can see and do depends on the permissions their account has. The app is a thin, fast client for the
**Bank REST API** (Spring Boot, in the sibling `Bank` project): it keeps no business rules of its own for
money, and every sensitive action is checked again on the server.

The goals of the front-end are:

- **Fast daily work:** big touch targets, short flows, confirmations before anything irreversible.
- **Honest feedback:** every error from the API is turned into a clear message next to the action.
- **Works on a phone first:** the same app scales up to a desktop layout, not the other way around.

## Features

- **Sign-in** with JWT, plus a one-tap **demo account** panel for visitors.
- **Home dashboard** with live totals, the latest operations and shortcuts (only what the user may open).
- **Clients:** list, find (by ID or by account number), add, update, delete.
- **Money:** deposit, withdraw and transfer between accounts, each with a confirmation step and a receipt.
- **Logs:** deposits & withdrawals, transfers, and sign-ins (with a date-range search), all paginated.
- **Currencies:** rate list, search by code or country, a converter, and rate updates.
- **Staff:** list, find, add, update and delete users; a visual permission picker and viewer.
- **Permission-aware UI:** menus, tabs, shortcuts and routes adapt to each user's rights.
- **Responsive navigation:** bottom tab bar and drawer on phones, collapsible icon sidebar on desktop.

---

## Tour of the screens

### Sign in

The sign-in page shows the bank icon across half of the screen (the top half on a phone, the left half
on a wide screen). The small **"Try the demo"** note above the form has an animated info icon; it opens the
demo credentials, lets you copy them, or fills the form with one tap.

<table>
  <tr>
    <td><img src="docs/screenshots/desktop/01-login.png" alt="Sign-in page on desktop" width="470" /></td>
    <td><img src="docs/screenshots/desktop/02-login-demo.png" alt="Sign-in page with the demo panel open" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Sign-in</sub></td>
    <td align="center"><sub>Demo account panel opened</sub></td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="docs/screenshots/mobile/01-login.png" alt="Sign-in page on a phone" width="220" /></td>
    <td><img src="docs/screenshots/mobile/02-login-demo.png" alt="Sign-in page on a phone with the demo panel open" width="220" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Phone</sub></td>
    <td align="center"><sub>Phone, demo panel opened</sub></td>
  </tr>
</table>

### Home

A calm overview: a greeting, the **total balance** across all clients (it counts up when the page loads),
round **action buttons** for the most common operations, the **latest deposits and withdrawals**, and
grouped shortcuts. Sections the user has no permission for are simply not shown, and every block shows a
skeleton while its data loads.

<img src="docs/screenshots/desktop/03-home.png" alt="Home screen" width="720" />

### Navigation

On a wide screen the **sidebar** can be folded to a narrow **icon rail** with the menu button; the choice is
remembered. Names appear as tooltips, and a group (such as *Transactions*) unfolds the sidebar again when
clicked. On a phone the main places live in a **bottom tab bar** and **More** opens the full menu as a drawer.

<table>
  <tr>
    <td><img src="docs/screenshots/desktop/04-sidebar-collapsed.png" alt="Sidebar folded to icons" width="560" /></td>
    <td><img src="docs/screenshots/mobile/04-menu-drawer.png" alt="Menu drawer on a phone" width="220" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Icon rail (desktop)</sub></td>
    <td align="center"><sub>Drawer opened from <b>More</b> (phone)</sub></td>
  </tr>
</table>

### Clients

| Screen | What it does |
| --- | --- |
| **Client list** | All clients with their balance and the total. On a phone each row becomes a stacked entry instead of a squeezed table. |
| **Find client** | Search by **ID** or by **account number** (a segmented control switches between them). The result is a client card with a large balance. |
| **Add client** | Account number, 4-digit PIN, name, 8-digit phone, email and opening balance. Digit-only fields reject letters as you type; server validation errors appear under the right field. |
| **Update client** | Find a client, then edit name, phone, email and (optionally) the PIN. Account number and balance are locked: the balance changes only through transactions. |
| **Delete client** | Find a client, then confirm in a dialog. If the account still holds money, the card and the dialog warn about it. |

<table>
  <tr>
    <td><img src="docs/screenshots/desktop/05-clients-list.png" alt="Client list" width="470" /></td>
    <td><img src="docs/screenshots/desktop/06-client-find.png" alt="Client found by ID" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Client list</sub></td>
    <td align="center"><sub>Find client</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/desktop/07-client-add.png" alt="Add client form" width="470" /></td>
    <td><img src="docs/screenshots/desktop/08-client-update.png" alt="Update client form" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Add client</sub></td>
    <td align="center"><sub>Update client</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/desktop/09-client-delete-confirm.png" alt="Delete client confirmation" width="470" /></td>
    <td><img src="docs/screenshots/mobile/05-clients-list.png" alt="Client list on a phone" width="220" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Delete client (confirmation)</sub></td>
    <td align="center"><sub>Client list on a phone: stacked entries</sub></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/mobile/06-client-find.png" alt="Client card on a phone" width="220" /><br />
  <sub>A client card on a phone</sub>
</p>

### Money: deposit, withdraw, transfer

Every money operation follows the same three steps, so the flow is predictable and hard to get wrong:

1. **Fill in** the account (or the two accounts) and the amount.
2. **Confirm** in a dialog that repeats what is about to happen (red for a withdrawal, neutral otherwise).
3. **Receipt** with the new balance, or a clear message such as *insufficient balance* or *account not found*.

Deposit and withdraw share one reusable page component, configured with a small object.

<table>
  <tr>
    <td><img src="docs/screenshots/desktop/10-deposit-form.png" alt="Deposit form" width="310" /></td>
    <td><img src="docs/screenshots/desktop/11-deposit-confirm.png" alt="Deposit confirmation" width="310" /></td>
    <td><img src="docs/screenshots/desktop/12-deposit-receipt.png" alt="Deposit receipt" width="310" /></td>
  </tr>
  <tr>
    <td align="center"><sub>1 · Deposit form</sub></td>
    <td align="center"><sub>2 · Confirmation</sub></td>
    <td align="center"><sub>3 · Receipt</sub></td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="docs/screenshots/desktop/13-withdraw-confirm.png" alt="Withdraw confirmation" width="470" /></td>
    <td><img src="docs/screenshots/desktop/14-transfer-form.png" alt="Transfer form" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Withdraw: confirmation</sub></td>
    <td align="center"><sub>Transfer: two accounts with a swap button</sub></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/desktop/15-transfer-receipt.png" alt="Transfer receipt" width="620" /><br />
  <sub>Transfer receipt: both accounts and both new balances</sub>
</p>

<table>
  <tr>
    <td><img src="docs/screenshots/mobile/07-transfer-form.png" alt="Transfer form on a phone" width="220" /></td>
    <td><img src="docs/screenshots/mobile/08-transfer-confirm.png" alt="Transfer confirmation as a bottom sheet" width="220" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Transfer on a phone</sub></td>
    <td align="center"><sub>Confirmation as a bottom sheet</sub></td>
  </tr>
</table>

### Logs

The **deposits & withdrawals log** and the **transfers log** list every operation, newest first, with the
employee who did it and the balance afterwards. Both use server-side pagination with a rows-per-page
selector, and keep the table on screen (dimmed) while the next page loads.

<table>
  <tr>
    <td><img src="docs/screenshots/desktop/16-transaction-log.png" alt="Deposits and withdrawals log" width="470" /></td>
    <td><img src="docs/screenshots/desktop/17-transfer-log.png" alt="Transfers log" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Deposits &amp; withdrawals</sub></td>
    <td align="center"><sub>Transfers</sub></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/mobile/10-transaction-log.png" alt="Transaction log on a phone" width="220" /><br />
  <sub>The log on a phone</sub>
</p>

### Staff (requires the *manage users* permission)

| Screen | What it does |
| --- | --- |
| **Users** | Every employee; the eye button opens their permissions as a checklist. |
| **Add user** | Name, username, phone, password and a **permission picker** (checkboxes that build the permission number). |
| **Find / Update / Delete user** | Find by ID. Updating keeps the old password unless a new one is typed. You cannot delete your own account. |

<table>
  <tr>
    <td><img src="docs/screenshots/desktop/18-users-list.png" alt="Users list" width="470" /></td>
    <td><img src="docs/screenshots/desktop/19-user-permissions.png" alt="User permissions viewer" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Users</sub></td>
    <td align="center"><sub>Permissions of a user</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/desktop/20-user-add.png" alt="Add user form with the permission picker" width="470" /></td>
    <td><img src="docs/screenshots/desktop/21-user-find.png" alt="Find user" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Add user, with the permission picker</sub></td>
    <td align="center"><sub>Find user</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/desktop/22-user-update.png" alt="Update user" width="470" /></td>
    <td><img src="docs/screenshots/desktop/23-user-delete-confirm.png" alt="Delete user confirmation" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Update user</sub></td>
    <td align="center"><sub>Delete user (confirmation)</sub></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/mobile/09-user-permissions.png" alt="Permissions as a bottom sheet on a phone" width="220" /><br />
  <sub>Permissions as a bottom sheet on a phone</sub>
</p>

### Login register

Every successful sign-in is recorded by the server. This page lists them with the permissions the user had **at
that moment**, and supports a **from / to date-time search** (applied only when you press *Search*, so paging
through results never mixes two different searches).

<img src="docs/screenshots/desktop/24-login-register.png" alt="Login register" width="720" />

### Currencies

Rates are stored against the US dollar. Anyone signed in can browse and convert; changing a rate needs the
*transactions* permission.

| Screen | What it does |
| --- | --- |
| **Currency list** | All currencies with a live text filter (country, code or name). |
| **Find currency** | Exact search by code or by country. One code can belong to several countries (EUR), so the result is a table. |
| **Calculator** | Amount, two currencies and a swap button; the answer is shown as a large figure with the unit rate. |
| **Update rate** | Shows every country that shares the code before you change it, then asks for confirmation. USD, the base of all rates, is locked. |

<table>
  <tr>
    <td><img src="docs/screenshots/desktop/25-currencies.png" alt="Currency list" width="470" /></td>
    <td><img src="docs/screenshots/desktop/26-currency-find.png" alt="Find a currency" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Currency list</sub></td>
    <td align="center"><sub>Find currency (EUR is shared by several countries)</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/desktop/27-currency-calculator.png" alt="Currency calculator" width="470" /></td>
    <td><img src="docs/screenshots/desktop/28-currency-update-rate.png" alt="Update an exchange rate" width="470" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Calculator</sub></td>
    <td align="center"><sub>Update rate</sub></td>
  </tr>
</table>

---

## Permissions and access control

Each employee has one integer, a **bitmask**: every permission is a power of two, and a user's value is the
sum of the permissions they hold. `-1` means *all permissions*.

| Value | Permission | Opens |
| ---: | --- | --- |
| `1` | `LIST_CLIENTS` | Client list |
| `2` | `ADD_NEW_CLIENT` | Add client |
| `4` | `DELETE_CLIENT` | Delete client |
| `8` | `UPDATE_CLIENTS` | Update client |
| `16` | `FIND_CLIENT` | Find client |
| `32` | `TRANSACTIONS` | Deposit, withdraw, transfer, both money logs, rate updates |
| `64` | `MANAGE_USERS` | Every user page |
| `128` | `LOGIN_REGISTER_SCREEN` | Login register |

The check is one line, `(required & userPermissions) === required`, in [`src/utils/permissions.js`](src/utils/permissions.js).
It is used in three places:

- **Routes:** `ProtectedRoute` redirects to sign-in without a token and shows *Access denied* without the permission.
- **Navigation:** the sidebar, the bottom tabs and the home shortcuts hide what the user cannot open.
- **Data:** home figures are only requested when the permission exists.

> The UI is a convenience, **not** a security boundary. The API enforces every permission again, and
> the app handles a `403` from the server like any other result.

## Design and responsiveness

- **Mobile first.** Base styles are for a phone; `min-width` media queries add room. Touch targets are at least
  44 px, inputs use 16 px text (so iOS does not zoom), and the bottom bar respects the safe area.
- **Adaptive patterns, not just smaller layouts:** tables become stacked entries, dialogs become bottom sheets,
  the sidebar becomes a drawer plus a tab bar, forms go from one column to two.
- **A small design system** in plain CSS: colour, radius, spacing and motion tokens as custom properties in
  [`src/index.css`](src/index.css), shared classes (`.btn`, `.input`, `.card`, `.skeleton`…), and one font
  ([Manrope](https://fonts.google.com/specimen/Manrope)). Changing the palette is a matter of a few variables.
- **Feedback everywhere:** skeleton loaders, disabled and busy states on buttons, confirmation before destructive
  actions, receipts after money operations.
- **Accessibility basics:** visible focus rings, ARIA labels on icon buttons, `aria-expanded` and `aria-current`
  where they apply, and `prefers-reduced-motion` support (animations and counters switch off).

## Tech stack

| | |
| --- | --- |
| **UI** | React 19 (function components and hooks) |
| **Routing** | React Router 7 (nested routes, route guards) |
| **HTTP** | Axios, with request/response interceptors |
| **Build** | Vite 8 |
| **Icons** | react-icons |
| **Styling** | Plain CSS with custom properties (no UI framework) |
| **Quality** | ESLint with the React Hooks rules |

## Getting started

**Prerequisites:** Node.js 20.19+ (or 22.12+) and a running [Bank API](#talking-to-the-api).

```bash
# 1. Install dependencies
npm install

# 2. (Optional) point the app at another API: copy the example file and edit it
cp .env.example .env

# 3. Start the development server  ->  http://localhost:5173
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8080/api` | Base URL of the API, including `/api` |

### The demo account

The sign-in page offers a demo account to visitors. Its credentials are shown from
[`src/config/demoAccount.js`](src/config/demoAccount.js) and **must match** the account the API creates:
the API creates a `demo` user when it is started with a `DEMO_PASSWORD`, with every permission **except**
managing users. Use a password that is not used anywhere else: it is public by design.

## Talking to the API

The app expects the **Bank API** (Spring Boot, the sibling `Bank` project; see its README to run it).
By default it listens on `http://localhost:8080` and allows the origin `http://localhost:5173`; to serve
the front-end from another origin, set `CORS_ALLOWED_ORIGINS` on the API.

All requests go through one Axios instance in [`src/service/api.js`](src/service/api.js):

- **Request interceptor:** adds `Authorization: Bearer <token>` from `localStorage`.
- **Response interceptor:** on `401` (expired or invalid token) it clears the session and returns to the
  sign-in page; the sign-in request itself is excluded, so a wrong password does not loop.
- **Pages** translate status codes into messages: `400` field errors under the field, `403` permission,
  `404` not found, `409` conflicts such as a duplicate phone, and *cannot connect to server*.

## Project structure

```text
src/
├── components/        Reusable pieces
│   ├── BottomNav/       Phone tab bar
│   ├── Sidebar/         Menu: drawer on phones, collapsible rail on desktop
│   ├── Header/  DashboardLayout/  ProtectedRoute/
│   ├── TransactionPage/ Shared deposit / withdraw page, driven by a config object
│   ├── ConfirmModal/  PermissionsModal/  PermissionsPicker/
│   ├── Pagination/  CountUp/  DemoInfo/
│   └── ClientCard/  UserCard/  ClientSearch/
├── pages/             One folder per screen (Login, Dashboard, clients, users, money, logs, currencies…)
├── service/api.js     The Axios instance and its interceptors
├── utils/             permissions.js (bitmask helpers), format.js (money, dates, initials)
├── config/            demoAccount.js
├── App.jsx            Routes
└── index.css          Design tokens and shared component styles
docs/screenshots/      Images used by this README (desktop/ and mobile/)
```

## Quality and known limitations

Being open about what is not there yet:

- **No automated tests for the front-end** yet (the API has unit and integration tests). Component and
  end-to-end tests are the next step.
- **The token is kept in `localStorage`.** That is simple, but readable by any script running on the page; an
  `HttpOnly` cookie would be safer for a real deployment.
- **Client and user lists are not paginated** (the logs are). Fine for hundreds of rows, not for thousands.
- **The home balance is summed in the browser** from the client list; a server-side total would scale better.
- **English only**, left-to-right layout.
- The sign-in image is a raster file; a vector logo would stay sharp at any size.
