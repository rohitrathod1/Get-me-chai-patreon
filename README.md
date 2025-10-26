# ☕ Get Me a Chai!

**A modern platform where creators and developers can receive direct financial support (a cup of virtual chai ☕ or a donation) for their work from visitors and followers.**

## 🌐 Live Application

You can view and test the live version of this project here:

**👉 [get-me-chai-patreon.vercel.app](https://get-me-chai-patreon.vercel.app)**

***

## 🎯 Overview (What This Does)

`Get Me a Chai` is a lightweight, "Buy Me a Coffee"-style application designed to facilitate small-scale financial support/donations to creators and contributors.

### Key Features

| Icon | Feature | Description |
| :--- | :--- | :--- |
| 🔑 | **Simple Authentication** | Users can easily log in using three popular social providers: **Google, Facebook, and GitHub**. |
| 💾 | **Automatic Profile Creation** | Upon first sign-in, the application automatically creates a user profile (with username and email) in the database. |
| 🛡️ | **Secure Backend** | Secure and robust authentication powered by NextAuth.js and MongoDB. |

***

## 🛠️ Tech Stack (Technologies Used)

This project is built on the modern MERN stack principles, utilizing **NextAuth.js** for seamless serverless authentication.

| Category | Technology | Icon |
| :--- | :--- | :--- |
| **Frontend/Framework** | **Next.js** (React) | ⚛️ |
| **Authentication** | **NextAuth.js** | 🔐 |
| **Database** | **MongoDB** & **Mongoose** | 🍃 |
| **Styling** | **Tailwind CSS** | 🎨 |
| **Deployment** | **Vercel** | ☁️ |

***

## 💡 How It Works (Working Mechanism)

The application's flow is primarily defined by the **NextAuth.js Callbacks** and its integration with **MongoDB**.

### 1. Social Sign-in Process (Authentication Flow)

1.  A user navigates to the Login page (`/login`) and clicks an **OAuth Provider** button.
2.  NextAuth.js redirects the user to the provider's login page (e.g., Google).
3.  Upon successful authentication, the provider sends the user back to the application's secure **`redirect_uri`** (`/api/auth/callback/[provider]`).

### 2. Database Integration & User Creation

1.  The **`signIn` callback** function within NextAuth.js is triggered.
2.  The application connects to MongoDB and checks if the user's **email** already exists:
    * **New User:** If the user is not found, a new `User` document is created (storing the email and an auto-generated username).
    * **Existing User:** The sign-in process is permitted.
3.  The **`session` callback** ensures the user's session data is enriched with the correct username from the database.

***

## ⚙️ Local Setup (Running the Project Locally)

### Prerequisites:

* Node.js (v18+)
* MongoDB Atlas Account (or local MongoDB)
* OAuth App Credentials (Client IDs and Secrets for Google, Facebook, GitHub)

### Steps:

1.  **Clone and Install:**
    ```bash
    git clone [Your Repository URL]
    cd get-me-a-chai
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a `.env.local` file in the project root and fill in your credentials:

    ```bash
    # MongoDB Connection String
    MONGODB_URI="..."

    # Security Key (Required by NextAuth.js)
    NEXTAUTH_SECRET="..."

    # OAuth Providers Credentials
    GOOGLE_ID="..."
    GOOGLE_SECRET="..."

    FACEBOOK_ID="..."
    FACEBOOK_SECRET="..."

    GITHUB_ID="..."
    GITHUB_SECRET="..."
    ```

3.  **Register Redirect URIs:**
    You must add the following **development Redirect URI** to the settings of all your OAuth providers (Google, Facebook, GitHub):

    $$\text{http://localhost:3000/api/auth/callback/[provider]}$$

4.  **Run Application:**
    ```bash
    npm run dev
    ```
    The application will now be running on **`http://localhost:3000`**.

***

## 🤝 Contribution

Contributions are welcome! If you find a bug or want to add a new feature, please open an **Issue** or submit a **Pull Request**.
