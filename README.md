# 🌱 Sprout: Wellness Tracker

Sprout is a personalized, flexible health and activity logging application. It allows users to track varied physical activities without the constraints of rigid database structures.

This project was built to demonstrate  **NoSQL concepts**, specifically data modeling and server-side aggregation pipelines.

## ✨ Key Features (CRUD & Reporting)

* **Create (Logging):** Users can log different types of activities (e.g., "Running" vs. "Weightlifting"). The form dynamically adapts to the activity type, generating entirely different JSON structures for the exact same database collection.
* **Read (History & Dashboard):** Fetches and renders unstructured `metrics` data natively, automatically adjusting the UI card layout based on the data shape.
* **Update (Edit):** Dynamic routes pre-fill forms with existing NoSQL documents, allowing users to modify nested arrays and flat key-value pairs effortlessly.
* **Delete:** Instantly remove records via targeted API routes.
* **Reporting (Aggregation Pipelines):** The dashboard calculates total global minutes and activity distribution using native MongoDB `$group` and `$sum` pipelines, handling data processing at the database level rather than the client level.

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (App Router), React, Tailwind CSS v4 (Custom Soft UI/Neumorphism)
* **Backend:** Next.js Server Components & API Routes
* **Database:** MongoDB Atlas (Document Store)
* **ODM:** Mongoose (TypeScript)

## 💡 NoSQL vs. SQL Justification

Traditional Relational Databases (SQL) struggle with heterogeneous fitness data. A "Running" session requires fields like `distance_km` and `pace`, while a "Weightlifting" session requires an array of `sets` (weight and reps). 

If built with SQL, this would require either a table full of `NULL` columns (Anti-pattern) or multiple complex `JOIN` operations across an `Activities` table and a `Sets` table.

**The Sprout Solution:** By utilizing a **NoSQL Document Store (MongoDB)** and a flexible Mongoose `Mixed` schema type, Sprout stores completely different JSON structures within a single `activities` collection. This allows for:
1.  **Schema Evolution:** New activity types (e.g., Yoga, Swimming) can be added instantly without running `ALTER TABLE` migrations.
2.  **Data Locality:** All information for a single workout (including nested sets) is retrieved in a single atomic read operation, drastically improving performance.

## 🚀 Getting Started

To run this project locally:

### 1. Clone the repository
```bash
git clone https://github.com/nnpx/sprout-exercise-tracking.git
```

### 2. Create .env.local and add your MONGODB_URI key

```bash
MONGODB_URI=your_MONGODB_URI_key
```

### 3. Run the development server

```bash
npm run dev
```