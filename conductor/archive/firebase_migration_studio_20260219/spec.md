# Specification: Pure Firebase Migration & Management Studio

## Overview
This track finalizes the transition to a pure Firebase architecture by migrating the remaining data catalog (Services and Brands) from Prisma/SQLite to Firestore. It also implements a premium "Management Studio" in the Admin Panel for full CRUD operations on the catalog, featuring a hybrid asset management system for icons and images.

## User Stories
- As an **Admin**, I want to manage the entire Service and Brand catalog through a beautiful Master-Detail interface.
- As an **Admin**, I want to upload new brand logos or choose from a preset library of automotive icons for services.
- As an **Admin**, I want to toggle service visibility and update pricing/details in real-time.
- As a **System**, I want to fetch all bookings and user data from Firestore to ensure a unified data layer.

## Functional Requirements

### 1. Firestore Catalog Migration
- Implement a one-time migration utility to move all `Service` and `Brand` definitions from SQLite to the `smartmotordb` Firestore database.
- Update the `BookingForm` and `BrandPage` to fetch their source data exclusively from Firestore.

### 2. Management Studio (Admin UI)
- **Layout:** A responsive Master-Detail view (Sidebar list + detailed editing pane).
- **Service Management:**
  - Create, Read, Update, Delete (CRUD) for all service metadata.
  - "Active" toggle to instantly show/hide services from the consumer site.
- **Brand Management:**
  - Full CRUD for brands, including heritage stories and model lists.

### 3. Hybrid Asset Manager
- **Asset Library:** A central modal/view to browse previously uploaded media.
- **Direct Upload:** Drag-and-drop upload functionality integrated into Service/Brand forms.
- **Preset Library:** A curated collection of automotive SVG/PNG icons for quick service assignment.

### 4. Pure Firebase Booking System
- Refactor the `createBooking` server action to write directly to Firestore instead of Prisma.
- Update the Admin Dashboard's "Recent Activity" to stream real-time booking updates from Firestore.

## Technical Constraints
- **Database:** Firestore (`smartmotordb`).
- **File Storage:** Firebase Storage for all direct uploads.
- **Real-time:** Use Firestore listeners for dashboard activity updates.
- **Styling:** Adhere to "Gold Standard" (Sidebar glassmorphism, rounded-2xl cards).

## Acceptance Criteria
- [ ] All 50+ automotive brands and their models are successfully migrated to and fetched from Firestore.
- [ ] Admin can add a new service, upload an icon, and see it appear on the Home page immediately.
- [ ] New bookings are saved to Firestore and appear in the Dashboard "Recent Activity" widget in real-time.
- [ ] No further writes are made to the local SQLite database for catalog or booking data.

## Out of Scope
- Migrating historical booking data from SQLite (Fresh start for user data).
- Batch bulk-edit tools (editing items one by one for now).
