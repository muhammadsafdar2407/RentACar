-- Enable UUID extension for generating UUID values
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customer table
CREATE TABLE customer (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customername VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    phone_number VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL
);

-- Vehicle Post table
CREATE TABLE vehicle_post (
    vehicle_number VARCHAR(50) PRIMARY KEY,
    customer_id UUID NOT NULL,
    vehicle_name VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_brand VARCHAR(50) NOT NULL,
    vehicle_year VARCHAR(50) NOT NULL,
    vehicle_color VARCHAR(50) NOT NULL,
    vehicle_description TEXT NOT NULL,
    address VARCHAR(50) NOT NULL,
    vehicle_listing_type VARCHAR(50),
    vehicle_features VARCHAR(200) NOT NULL,
    vehicle_image VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    available BOOLEAN DEFAULT TRUE,
    price_per_day DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Review table
CREATE TABLE review (
    comment_id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(50),
    customer_id UUID NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    customer_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    FOREIGN KEY (vehicle_number) REFERENCES vehicle_post(vehicle_number) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Booking table
CREATE TABLE booking (
    booking_id SERIAL PRIMARY KEY,
    booking_customer_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    vehicle_number VARCHAR(50),
    total_cost DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    start_date VARCHAR(12) NOT NULL,
    end_date VARCHAR(12) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (booking_customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (owner_id) REFERENCES customer(customer_id),
    FOREIGN KEY (vehicle_number) REFERENCES vehicle_post(vehicle_number) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    notification_message TEXT NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES customer(customer_id),
    FOREIGN KEY (receiver_id) REFERENCES customer(customer_id)
);

-- Conversation table
CREATE TABLE conversation (
    conversation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    members UUID[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Message table
CREATE TABLE message (
    message_id SERIAL PRIMARY KEY,
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id),
    FOREIGN KEY (sender_id) REFERENCES customer(customer_id),
    FOREIGN KEY (receiver_id) REFERENCES customer(customer_id)
);

-- Online Users table
CREATE TABLE online_users (
    customer_id UUID PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    socket_id VARCHAR(100) NOT NULL,
    last_seen TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

-- Promotions table
CREATE TABLE promotions (
    email VARCHAR(255) PRIMARY KEY,
    customer_id UUID,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
