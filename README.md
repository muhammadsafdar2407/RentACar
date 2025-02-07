# GearUp - Peer-to-Peer Vehicle Rental & Selling Platform

## Introduction
GearUp is a community-based platform that allows users to rent or sell their vehicles directly to other users. The platform is designed with a simple user interface, making it easy to navigate and use for both renters and sellers.

## Background
Finding vehicles for rent or sale can be a time-consuming process. Inspired by the success of peer-to-peer services, GearUp combines this concept with user-friendly technology, streamlining the renting and selling process. The PERN stack (PostgreSQL, Express.js, React.js, and Node.js) was chosen for its flexibility and scalability.

## Features
- User Authentication (Signup/Login)
- Vehicle Listings with Detailed Descriptions
- Vehicle Booking System
- User Dashboard to View Listings and Bookings
- Filtered Search for Vehicles
- Real-Time Chat Between Users
- Comment and Review System
- Notifications System

## Technology Stack
- **Front-End:** React.js
- **Back-End:** Node.js, Express.js
- **Database:** PostgreSQL
- **Real-Time Communication:** Socket.io

## Database Schema
The platform consists of the following key tables:

### `Customer`
Stores user information, including login credentials, contact details, and timestamps.

### `Vehicle_post`
Contains vehicle details such as name, type, brand, year, color, description, availability, pricing, and images.

### `Booking`
Tracks rental bookings with details on customers, owners, rental duration, and total cost.

### `Review`
Stores user-generated reviews and ratings for vehicles.

### `Message` & `Conversation`
Facilitates real-time messaging between users.

### `Notifications`
Logs notifications such as booking updates and message alerts.

### `Promotions`
Tracks promotional email subscriptions for users.

### `Online_users`
Monitors active users and their status for real-time features.

## Installation & Setup
### Prerequisites
- Install [PostgreSQL](https://www.postgresql.org/download/)
- Install [Node.js](https://nodejs.org/)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/muhammadsafdar2407/RentACar.git
   cd RentACar
   ```
2. Set up the database:
   - Copy the database schema from `db.sql` (found in `src/server` folder) and run it in PostgreSQL.
   - Update database details in `database.js` and `server.js`.
3. Install dependencies:
   ```sh
   cd client
   npm install
   npm run dev  # Starts the front-end
   ```
   ```sh
   cd ../server
   npm install
   npm start  # Starts the back-end
   ```

## Testing & Development
- **Functional Testing:** API and user workflows.
- **UI/UX Testing:** Ensuring responsiveness and accessibility.
- **Database Stress Tests:** Checking for scalability.

## Screenshots
- **Login/Signup Page**
- **Adding a Listing**
- **Filtered Searching**
- **Booking System**
- **Profile View**
- **Live Chat**
- **Comments & Reviews**

## Conclusion
GearUp provides an easy-to-use and efficient alternative for renting and selling vehicles. By streamlining the process of listing, communication, and booking, the platform directly connects sellers and buyers in a user-friendly way.

## Contributors
- Muhammad Safdar (22k-4304)
- Abdul Rafiu (22k-4162)
- Syed Mohammed Rayyan Imam (22k-4153)

## Contact
For inquiries or support, feel free to open an issue or contact the contributors.

