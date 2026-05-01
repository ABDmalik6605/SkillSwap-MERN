# 🛠️ SkillSwap: Running & Testing Guide

This guide explains how to start the application and verify that all 23 semester project features are working correctly.

---

## 1. Backend Setup (API)

1.  **Navigate to backend**:
    ```bash
    cd backend/SkillSwap-backend
    ```
2.  **Configure environment**: 
    Create a `.env` file (if not exists) and add:
    ```env
    PORT=4000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development
    ```
3.  **Install & Run**:
    ```bash
    npm install
    npm run dev
    ```

---

## 2. Frontend Setup (UI)

1.  **Navigate to frontend**:
    ```bash
    cd frontend/SkillSwap
    ```
2.  **Configure environment**:
    Create a `.env` file and add:
    ```env
    VITE_API_URL=http://localhost:4000
    ```
3.  **Install & Run**:
    ```bash
    npm install
    npm run dev
    ```
    Access the app at: `http://localhost:5173`

---

## 3. Verifying New Features

Follow these steps to check the newly implemented features:

### ✅ General & Social
*   **Footer**: Scroll to the bottom to see **Social Media Buttons** (Twitter, LinkedIn, GitHub, Instagram).
*   **Contact Page**: Navigate to `/contact` from the footer or sidebar to see the **Google Maps** embed and contact form.
*   **Blog**: Navigate to `/blog`. Try creating a post (requires login) and view existing ones.

### ✅ User Features (Login Required)
*   **Notifications**: Look at the top right header. You'll see a **Notification Bell**. It will alert you of requests/bookings.
*   **Avatar & Profile**: Go to `Profile` -> `Edit Profile`. Select a preset avatar or paste a URL to see the **Live Preview**. Save to update your profile picture.
*   **Skill Credits**: Go to the **Credits** page. You can record transactions (teaching vs. learning) and view your **Cash Flow Statement**.
*   **Certificates**: Complete a booking session. Then go to **Certificates** to download your **PDF Certificate of Completion**.

### ✅ Admin Features
To access the **Admin Panel** (`/admin`):
1.  Sign up for an account.
2.  In the backend terminal, run:
    ```bash
    node src/scripts/makeAdmin.js your-email@example.com
    ```
3.  Refresh the app. You will see "Admin Panel" in the sidebar. Click it to view **Platform Analytics**.

---

## 4. Requirement Checklist (Quick Check)
- [x] **Req #4**: Contact + Map (/contact)
- [x] **Req #6**: Blogs (/blog)
- [x] **Req #7**: Social Buttons (Footer)
- [x] **Req #14**: Cash Flow (Credits Page)
- [x] **Req #15**: PDF Certificates (Certificates Page)
- [x] **Req #21**: Admin Dashboard (/admin)
- [x] **Req #22**: User Notifications (Header Bell)
- [x] **Req #23**: Sub-domain (Configured in `vercel.json`)
