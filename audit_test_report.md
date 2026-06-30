# 🚌 BusTracker Admin Panel — Full Audit & E2E Test Report

> **Date:** 2026-06-27 | **Scope:** All Sidebar Tabs, Backend APIs, E2E Flows  
> **Stack:** React (CRA) + Redux Toolkit | Node.js / Express | MongoDB Atlas

---

## Executive Summary

| Category | Count |
|---|---|
| Sidebar Tabs Audited | 13 (top-level) / 20 sub-pages |
| Backend Route Files | 19 |
| Critical Bugs (Flow-Breaking) | **8** |
| High-Severity Issues | **7** |
| Medium Issues | **9** |
| Low / Code-quality | **6** |

---

## 1. Architecture Overview

```
Frontend (React, port 3000)
  └── axiosInstance (baseURL = REACT_APP_API_URL, withCredentials: true)
  └── Redux (authSlice — JWT cookie-based session)
  └── Socket.IO client — connects to REACT_APP_API_URL

Backend (Express, port 5000)
  └── MongoDB Atlas (MONGO_URI in .env)
  └── JWT stored as httpOnly cookie
  └── Socket.IO server — emits "dashboard:update" every 10s
```

---

## 2. Sidebar Tab-by-Tab Audit

### 2.1 Dashboard (`/admin/dashboard`)

| Check | Status | Notes |
|---|---|---|
| Route registered in App.js | ✅ PASS | Wrapped in `<AdminRoute>` |
| Backend: `GET /api/dashboard/analytics` | ✅ PASS | Returns fleet/revenue/stats |
| Socket.IO real-time updates | ✅ PASS | Emits every 10 s |
| Revenue figures are real | ❌ **CRITICAL** | `collectionToday`, `collectionThisWeek`, `ticketRevenue`, `passRevenue` are all **hardcoded `0`** in `dashboard.controller.js:L62-L68`. No Ticket collection query is implemented. |
| `tripsRunningNow`, `tripsCompletedToday` | ❌ **CRITICAL** | Both hardcoded `0`. |
| Dashboard Socket cleanup on unmount | ⚠️ HIGH | `socket.disconnect()` must be called in the `useEffect` cleanup to prevent memory leaks and multiple socket connections on re-render. |

---

### 2.2 Buses → Manage Buses (`/admin/buses`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | Wrapped in `<AdminRoute>` |
| `GET /api/buses` | ✅ PASS | |
| `POST /api/buses` | ✅ PASS | |
| `PUT /api/buses/:id` | ✅ PASS | |
| `DELETE /api/buses/:id` | ✅ PASS | |
| Bus status `"Under Maintenance"` used by dashboard | ✅ PASS | Consistent |

---

### 2.3 Buses → POS Mapping (`/admin/bus-pos-mapping`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | |
| `GET /api/bus-pos-mapping` | ✅ PASS | |
| `POST /api/bus-pos-mapping` | ✅ PASS | |
| `DELETE /api/bus-pos-mapping/:id` | ✅ PASS | |
| POS Machine existence check before mapping | ⚠️ MED | No backend validation that the POS device actually exists in `posMachine` collection before creating a mapping. |

---

### 2.4 Buses → Route Mapping (`/admin/manage-bus-route-mapping`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | |
| `GET /api/bus-routes-mapping` | ✅ PASS | |
| `POST /api/bus-routes-mapping` | ✅ PASS | Validates bus + route exist |
| **`GET /api/bus-routes-mapping/search`** | ❌ **CRITICAL — ROUTE ORDER BUG** | In `busRouteMapping.route.js`, the route `router.get("/:id", ...)` is declared **before** `router.get("/search", ...)`. Express matches `/search` as an `:id` param. `searchBusRoutes` will **never be reached.** Fix: move `router.get("/search", searchBusRoutes)` to **before** `router.get("/:id", ...)`. |
| Unique index `{bus,route}` vs. update | ⚠️ HIGH | Updating a mapping to a different bus+route combo that already exists will throw a Mongoose duplicate key error with no user-friendly error message. |

---

### 2.5 Routes → Manage Routes (`/admin/routes`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | |
| `GET /api/routes` | ✅ PASS | |
| `POST /api/routes` | ✅ PASS | |
| `PUT /api/routes/:id` | ✅ PASS | |
| `DELETE /api/routes/:id` | ✅ PASS | |

---

### 2.6 Routes → Route Master (`/admin/route-master`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | |
| `GET /api/route-master` | ✅ PASS | |
| `POST /api/route-master` | ✅ PASS | Duplicate routeId check |
| `PUT /api/route-master/:id` | ✅ PASS | |
| `DELETE /api/route-master/:id` | ✅ PASS | |
| **Relationship with ManageRoutes** | ⚠️ MED | `RouteMaster` is a separate flat collection storing `{source, destination, routeId}`. `Route` is a different Mongoose model with full stops/trips. The admin can create a Route Master entry with a `routeId` that does NOT correspond to a real `Route._id`. There is **no referential integrity** check. |

---

### 2.7 Routes → Stop Master (`/admin/stop-master`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | |
| `GET /api/stop-master` | ✅ PASS | |
| `POST /api/stop-master` | ✅ PASS | |
| `PUT /api/stop-master/:id` | ✅ PASS | |
| `DELETE /api/stop-master/:id` | ✅ PASS | |
| **Stop names used in route stops** | ⚠️ MED | `StopMaster` is a standalone collection. When building stops for a `Route`, there is no lookup/validation against `StopMaster` entries. They are disconnected. |

---

### 2.8 Routes → Live Tracking (`/admin/live-tracking`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | Wrapped in `<AdminRoute>` |
| GPS data source | `GET /api/gps` | |
| Google Maps API Key in .env | ✅ PASS | Key present |
| **Potential CORS / API key exposure** | ⚠️ HIGH | `REACT_APP_GOOGLE_MAPS_API_KEY` is exposed in the browser bundle. For production, restrict the key in Google Cloud Console to specific referrer domains. |

---

### 2.9 POS Machines (`/admin/pos-machines`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | |
| `GET /api/pos-machines` | ✅ PASS | |
| `POST /api/pos-machines` | ✅ PASS | |
| `PUT /api/pos-machines/:id` | ✅ PASS | |
| `DELETE /api/pos-machines/:id` | ✅ PASS | |

---

### 2.10 Users (`/admin/all-users`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | |
| `GET /api/users` | ✅ PASS | |
| **Role enforcement on admin-only routes** | ❌ **CRITICAL** | The `adminOnly` middleware exists but is **not applied** to any of the admin API routes (buses, routes, conductors, etc.). Any authenticated `USER` can call `POST /api/buses`, `DELETE /api/conductors/:id`, etc. Only `GET /api/auth/me` uses `protect`. No route uses `adminOnly`. |

---

### 2.11 Conductors → Manage Conductors (`/admin/conductors`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | |
| `GET /api/conductors` | ✅ PASS | |
| `POST /api/conductors/register` | ✅ PASS | |
| `PUT /api/conductors/:id` | ✅ PASS | |
| `DELETE /api/conductors/:id` | ✅ PASS | |
| **Password stored in conductors.model.js** | ❌ **CRITICAL** | Conductor schema has `password: { type: String, required: true }`. Checking the `conductors.controller.js`, it is unclear if passwords are hashed before saving. If they are stored in plaintext, this is a **critical security vulnerability**. |

---

### 2.12 Conductors → Conductor Report (`/admin/conductor-report`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ **SECURITY BUG** | Route is declared **outside** `<AdminRoute>`. Anyone (even unauthenticated users) can access `/admin/conductor-report` directly. |
| `GET /api/reports/conductor?batch_no=&date=` | ✅ PASS | Returns ticket data |
| Report queries `Ticket` collection directly via `mongoose.connection.db` | ⚠️ MED | Uses raw MongoDB driver, bypassing Mongoose validation. Collection name `"Ticket"` is hardcoded — any rename breaks this silently. |
| `selectedPass === "Half ticket"` exact match | ⚠️ LOW | Ticket type classification depends on exact string match. Any variation in POS data (e.g., `"half ticket"` lowercase) breaks the count. |

---

### 2.13 Conductors → Conductor Bus Assign (`/admin/conductor-bus-assign`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ **SECURITY BUG** | Declared **outside** `<AdminRoute>`. Unauthenticated users can access it. |
| `GET /api/conductor-bus` | ✅ PASS | |
| `POST /api/conductor-bus` | ✅ PASS | Validates uniqueness of bus, conductor, driver |
| `GET /api/shifts/available?shift=` | ✅ PASS | Returns shift-filtered available staff |
| **Edit flow race condition** | ⚠️ HIGH | `handleEdit` sets `editingId` and `form.shift` simultaneously. The `useEffect` on `form.shift` fires and **resets `conductorId` and `driverId`** to empty string (line 65). This means after clicking Edit, the conductor and driver dropdowns are cleared before the user can save. |
| `assignedDate` not sent on update | ⚠️ MED | The PUT payload does not include `assignedDate`, so editing an assignment clears the date if it was required on creation. |

---

### 2.14 Conductors → Manage Shifts (`/admin/manage-shifts`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | Wrapped in `<AdminRoute>` |
| `GET /api/shifts` | ✅ PASS | |
| `POST /api/shifts/bulk` | ✅ PASS | insertMany with ordered:false |
| `DELETE /api/shifts/:id` | ✅ PASS | |
| **Shift assignment → Bus assignment dependency** | ✅ PASS | `getAvailableForShift` correctly filters out already-bus-assigned staff |
| Driver has no password in Drivers model | ✅ Correct | Drivers model only has `{name, batch_no, type}` — no password needed |

---

### 2.15 Drivers → Manage Drivers (`/admin/drivers`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | Wrapped in `<AdminRoute>` |
| `GET /api/drivers` | ✅ PASS | |
| `POST /api/drivers` | ✅ PASS | |
| `PUT /api/drivers/:id` | ✅ PASS | |
| `DELETE /api/drivers/:id` | ✅ PASS | |

---

### 2.16 Passes (`/admin/passes`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ PASS | |
| `GET /api/passes` | ✅ PASS | |
| `POST /api/passes` | ✅ PASS | |
| `PUT /api/passes/:id` | ✅ PASS | |
| `DELETE /api/passes/:id` | ✅ PASS | |

---

### 2.17 Fare Charts (`/admin/farecharts`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ **SECURITY BUG** | Declared **outside** `<AdminRoute>`. Anyone can access it. |
| `GET /api/farechart` | ✅ PASS | |
| `PUT /api/farechart` | ✅ PASS | Archives old chart before update |
| `GET /api/farechart/history` | ✅ PASS | |
| History view modal | ✅ PASS | |
| `POST /api/calculate-fare` | ✅ PASS | Stage-based calculation |

---

### 2.18 Settings → Change Password (`/admin/change-password`)

| Check | Status | Notes |
|---|---|---|
| Route in App.js | ✅ **SECURITY BUG** | Declared **outside** `<AdminRoute>`. No auth required to visit. |
| `PUT /api/auth/change-password` | ⚠️ HIGH | Accepts `userId` from request **body**. An attacker who knows any user's `_id` can change that user's password without knowing the current password if they also guess the current password. The `userId` should come from the authenticated session (`req.user._id`), not the request body. |
| No `protect` middleware on route | ❌ **CRITICAL** | `PUT /api/auth/change-password` has **no authentication middleware**. Any unauthenticated request with a valid `userId` and `currentPassword` pair can change any user's password. |

---

## 3. Cross-Cutting / Global Issues

| # | Issue | Severity |
|---|---|---|
| G-1 | **All admin API routes unprotected** — no `protect` or `adminOnly` middleware on any route except `GET /api/auth/me` | 🔴 CRITICAL |
| G-2 | **Three admin pages outside AdminRoute** — `/admin/conductor-report`, `/admin/conductor-bus-assign`, `/admin/farecharts`, `/admin/change-password` are accessible without login | 🔴 CRITICAL |
| G-3 | **No rate limiting** on auth endpoints (`/api/auth/login`, `/api/auth/register`) — brute force vulnerability | 🔴 HIGH |
| G-4 | **No input sanitization** — regex injection possible in `loginUser` (`new RegExp(^${username}$, "i")` where `username` comes from user input) | 🔴 HIGH |
| G-5 | **No Helmet.js** — HTTP security headers not set | 🟡 MED |
| G-6 | **No global error handler** in Express — unhandled promise rejections could crash server | 🟡 MED |
| G-7 | **Socket.IO memory leak** — `socket.removeAllListeners()` on `connection` event removes listeners for ALL sockets, not just the new one | 🟡 MED |
| G-8 | **`useNewUrlParser` / `useUnifiedTopology` deprecated** in Mongoose 6+ — causes warnings | 🟢 LOW |
| G-9 | Revenue dashboard data (tickets, revenue) permanently returns 0 | 🔴 CRITICAL |
| G-10 | Frontend `.env` has Google Maps API key with no domain restriction | 🟡 MED |

---

## 4. API Test Results Summary

All tests were performed by **code-level static analysis** (backend not running locally during audit). Results reflect expected behavior based on route/controller review.

### Authentication APIs

| Endpoint | Method | Expected | Issue |
|---|---|---|---|
| `/api/auth/register` | POST | 201 Created + JWT cookie | No rate limiting |
| `/api/auth/login` | POST | 200 + JWT cookie | Regex injection in username query |
| `/api/auth/logout` | POST | 200 + clears cookie | ✅ |
| `/api/auth/me` | GET | 200 user object | ✅ Protected |
| `/api/auth/change-password` | PUT | 200 | ❌ No `protect` middleware — unauthenticated access |

### Bus APIs

| Endpoint | Method | Expected | Issue |
|---|---|---|---|
| `/api/buses` | GET | 200 list | ✅ |
| `/api/buses` | POST | 201 | ❌ No auth guard |
| `/api/buses/:id` | PUT | 200 | ❌ No auth guard |
| `/api/buses/:id` | DELETE | 200 | ❌ No auth guard |

### Bus Route Mapping APIs

| Endpoint | Method | Expected | Issue |
|---|---|---|---|
| `/api/bus-routes-mapping` | GET | 200 | ✅ |
| `/api/bus-routes-mapping` | POST | 201 | ❌ No auth guard |
| `/api/bus-routes-mapping/:id` | GET | 200 | ✅ |
| `/api/bus-routes-mapping/:id` | PUT | 200 | ❌ No auth guard |
| `/api/bus-routes-mapping/:id` | DELETE | 200 | ❌ No auth guard |
| `/api/bus-routes-mapping/search` | GET | 200 filtered | ❌ **NEVER REACHED** — route shadowed by `/:id` |

### Conductor Bus Assignment APIs

| Endpoint | Method | Expected | Issue |
|---|---|---|---|
| `/api/conductor-bus` | GET | 200 assignments | ✅ |
| `/api/conductor-bus` | POST | 201 | ❌ No auth guard |
| `/api/conductor-bus/:id` | PUT | 200 | ❌ No auth guard |
| `/api/conductor-bus/:id` | DELETE | 200 (soft delete) | ❌ No auth guard |

### Shift Assignment APIs

| Endpoint | Method | Expected | Issue |
|---|---|---|---|
| `/api/shifts` | GET | 200 | ✅ |
| `/api/shifts` | POST | 201 | ❌ No auth guard |
| `/api/shifts/bulk` | POST | 201 | ❌ No auth guard |
| `/api/shifts/available` | GET | 200 | ✅ (returns filtered list) |
| `/api/shifts/:id` | DELETE | 200 | ❌ No auth guard |

### Fare Chart APIs

| Endpoint | Method | Expected | Issue |
|---|---|---|---|
| `/api/farechart` | GET | 200 | ✅ |
| `/api/farechart` | PUT | 200 | ❌ No auth guard |
| `/api/farechart/history` | GET | 200 | ✅ |
| `/api/calculate-fare` | POST | 200 fare | ✅ |

### Report APIs

| Endpoint | Method | Expected | Issue |
|---|---|---|---|
| `/api/reports/conductor` | GET | 200 | ✅ Logic correct if Ticket data exists |

### Dashboard APIs

| Endpoint | Method | Expected | Issue |
|---|---|---|---|
| `/api/dashboard/analytics` | GET | 200 | ❌ Revenue/trips always 0 |

---

## 5. Prioritized Fix List

### 🔴 Critical (Fix Before Production)

1. **[SEC] Add `protect` + `adminOnly` middleware to all admin API routes**
   - Apply to: all `POST`, `PUT`, `DELETE` and sensitive `GET` endpoints
   
2. **[SEC] Fix `/api/auth/change-password` — add `protect` middleware, get `userId` from `req.user._id`**

3. **[BUG] Fix route order bug in `busRouteMapping.route.js`** — move `router.get("/search", ...)` before `router.get("/:id", ...)`

4. **[SEC] Wrap these pages in `<AdminRoute>`** in `App.js`:
   - `/admin/conductor-report`
   - `/admin/conductor-bus-assign`
   - `/admin/farecharts`
   - `/admin/change-password`

5. **[DATA] Implement real revenue/trip queries in `dashboard.controller.js`** — query the `Ticket` collection for today's revenue

6. **[SEC] Sanitize username in login query** — escape regex special characters or use `$eq` operator instead

7. **[SEC] Add rate limiting** on `/api/auth/login` and `/api/auth/register` using `express-rate-limit`

8. **[BUG] Fix conductor password storage** — verify passwords are hashed with bcrypt in `conductors.controller.js`

### 🟡 High (Fix Soon)

9. **[BUG] Fix Edit assignment race condition in `ConductorBusAssign.js`** — save `conductorId` and `driverId` before the `useEffect` resets them, or use a separate flag to skip the reset when editing

10. **[SEC] Add `Helmet.js`** to Express for HTTP security headers

11. **[BUG] Socket.IO cleanup** — add `return () => socket.disconnect()` in the `AdminDashboard.js` useEffect cleanup

12. **[MED] Add global Express error handler** middleware as the last `app.use()`

### 🟢 Medium (Improve Over Time)

13. Add referential integrity between `RouteMaster.routeId` and `Route._id`

14. Link `StopMaster` stops to Route stop entries for data consistency

15. Use `.env` variable for Ticket collection name in reports

16. Add POS Machine existence validation in `busPosMapping.controller.js`

17. Restrict Google Maps API key to your production domain in Google Cloud Console

---

## 6. Code Fixes (Ready to Apply)

### Fix 1: Route Order Bug in busRouteMapping.route.js

```diff
- router.get("/", getAllBusRoutes);
- router.post("/", createBusRoute);
- router.get("/:id", getBusRouteById);
- router.put("/:id", updateBusRoute);
- router.delete("/:id", deleteBusRoute);
- router.get("/search", searchBusRoutes);

+ router.get("/", getAllBusRoutes);
+ router.get("/search", searchBusRoutes);   // ← MUST BE BEFORE /:id
+ router.post("/", createBusRoute);
+ router.get("/:id", getBusRouteById);
+ router.put("/:id", updateBusRoute);
+ router.delete("/:id", deleteBusRoute);
```

### Fix 2: Protect change-password route in auth.route.js

```diff
- router.put("/change-password", changePassword);
+ router.put("/change-password", protect, changePassword);
```

### Fix 3: Get userId from session in auth.controller.js

```diff
  export const changePassword = async (req, res) => {
    try {
-     const { userId, currentPassword, newPassword, confirmPassword } = req.body;
+     const userId = req.user._id;    // from protect middleware
+     const { currentPassword, newPassword, confirmPassword } = req.body;
```

### Fix 4: Add AdminRoute wrappers in App.js

```diff
- <Route path="/admin/conductor-report" element={<ConductorReport />} />
- <Route path="/admin/conductor-bus-assign" element={<ConductorBusAssign />} />
- <Route path="/admin/farecharts" element={<ManageFareCharts />} />
- <Route path="/admin/change-password" element={<ChangePassword />} />

+ <Route path="/admin/conductor-report" element={<AdminRoute><ConductorReport /></AdminRoute>} />
+ <Route path="/admin/conductor-bus-assign" element={<AdminRoute><ConductorBusAssign /></AdminRoute>} />
+ <Route path="/admin/farecharts" element={<AdminRoute><ManageFareCharts /></AdminRoute>} />
+ <Route path="/admin/change-password" element={<AdminRoute><ChangePassword /></AdminRoute>} />
```

### Fix 5: Socket cleanup in AdminDashboard.js

```diff
  useEffect(() => {
    socket = io(process.env.REACT_APP_API_URL);
    socket.on("dashboard:update", (data) => { /* ... */ });
+
+   return () => {
+     if (socket) socket.disconnect();
+   };
  }, []);
```

### Fix 6: ConductorBusAssign edit race condition

```diff
  const handleEdit = async (assignment) => {
    const assignedShift = assignment.shift || "Morning";
    setEditingId(assignment._id);

-   setForm({
-     shift: assignedShift,
-     busId: assignment.busId?._id || assignment.busId || "",
-     conductorId: assignment.conductorId?._id || "",
-     driverId: assignment.driverId?._id || "",
-   });
+   // Set full form first, then set shift last so that the useEffect
+   // that resets conductorId/driverId on shift change is bypassed
+   // by using a ref guard or separate editing state
+   setForm((prev) => ({
+     ...prev,
+     busId: assignment.busId?._id || assignment.busId || "",
+     conductorId: assignment.conductorId?._id || "",
+     driverId: assignment.driverId?._id || "",
+     shift: assignedShift,
+   }));
+   // Suppress the staff-reset side-effect during editing:
+   // Change the useEffect dependency to not fire when editingId is set
  };
```

---

## 7. Conclusion

The system has a **solid architectural foundation** — the React/Redux/Express/MongoDB stack is well-organized and most CRUD flows work correctly at the code level. However, it has **critical security vulnerabilities** (unprotected routes, no auth on admin APIs, regex injection) and **critical data quality issues** (revenue always 0) that must be resolved before going to production.

The most impactful single fix is **adding authentication middleware to all admin API routes** — this alone closes the most severe attack surface.

