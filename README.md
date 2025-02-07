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
![1](https://github.com/user-attachments/assets/98be17a8-7b61-462b-993e-54f34e734ddf)
- **Login/Signup Page**
![2](https://github.com/user-attachments/assets/e9ffc417-db84-4985-87c7-f2d2c22f89b1)
- **Adding a Listing**
![3](https://github.com/user-attachments/assets/ec42f872-b5d7-4cf7-a565-6274ecf43fbc)
- **Filtered Searching**
![4](https://github.com/user-attachments/assets/6d482231-fc57-4d45-afbc-bba79109a8db)
- **Booking System**
![5](https://github.com/user-attachments/assets/79f2a246-1bf5-43f7-8993-9389e4954a79)
- **Profile View**
![6](https://github.com/user-attachments/assets/6ead60de-c195-4b41-8432-11ecbcacd2da)
- **Live Chat**
![7](https://github.com/user-attachments/assets/2fe7c426-fc65-4d67-9bdb-b99bb97d3d0a)
- **Comments & Reviews**
![8](https://github.com/user-attachments/assets/33df2ae8-f5cd-46a2-870b-b5b3abb9d5c9)


## Conclusion
GearUp provides an easy-to-use and efficient alternative for renting and selling vehicles. By streamlining the process of listing, communication, and booking, the platform directly connects sellers and buyers in a user-friendly way.

## Contributors
- Muhammad Safdar (22k-4304)
- Abdul Rafiu (22k-4162)
- Syed Mohammed Rayyan Imam (22k-4153)


