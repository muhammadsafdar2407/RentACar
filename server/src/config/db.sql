CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table customer(
    customer_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customername varchar(100) not null,
    password varchar(100) not null,
    email varchar(100) not null,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    phone_number varchar(100) not null,
    address varchar(100) not null
);

CREATE table vehicle_post(
    vehicle_number varchar(50),
    customer_id uuid not null,
    vehicle_name varchar(50) not null,
    vehicle_type varchar(50) not null,
    vehicle_brand varchar(50) not null,
    vehicle_year varchar(50) not null,
    vehicle_color varchar(50) not null,
    vehicle_description text not null,
    address varchar(50) not null,
    vehicle_listing_type varchar(50),
    vehicle_features varchar(200) not null,
    vehicle_image VARCHAR(100) not null,
    created_at timestamp default now(),
    available boolean default true,
    price_per_day DECIMAL(10,2) not null,
    PRIMARY KEY (vehicle_number),
    foreign key (customer_id) references customer(customer_id) on delete cascade
);

CREATE TABLE review (
    comment_id SERIAL PRIMARY KEY,
    vehicle_number varchar(50),
    customer_id UUID NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    customer_name VARCHAR(100) NOT NULL,
    rating int not null,
    FOREIGN KEY (vehicle_number) REFERENCES vehicle_post(vehicle_number) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

create table booking(
    booking_id serial primary key,
    booking_customer_id uuid not null,
    owner_id uuid not null,
    vehicle_number varchar(50),
    total_cost DECIMAL(10,2) not null,
    booking_status varchar(50) not null,
    created_at timestamp default now(),
    start_date varchar(12) not null,
    end_date varchar(12) not null,
    total_price DECIMAL(10,2) not null,
    foreign key (booking_customer_id) references customer(customer_id),
    foreign key (owner_id) references customer(customer_id),
    foreign key (vehicle_number) references vehicle_post(vehicle_number) on delete cascade
);


create TABLE notifications(
    notification_id SERIAL PRIMARY KEY,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    notification_message TEXT NOT NULL,
    foreign key (sender_id) references customer(customer_id),
    foreign key (receiver_id) references customer(customer_id)
);

create table conversation(
    conversation_id uuid primary key default uuid_generate_v4(),
    members uuid[] not null,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create table message(
    message_id serial primary key,
    conversation_id uuid not null,
    sender_id uuid not null,
    receiver_id uuid not null,
    message varchar(50) not null,
    created_at timestamp default now(),
    foreign key (customer_id) references customer(customer_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id),
    FOREIGN KEY (sender_id) REFERENCES customer(customer_id)
);

create table online_users(
    customer_id uuid primary key,
    customer_name varchar(100) not null,
    socket_id varchar(100) not null,
    last_seen timestamp default now(),  
    foreign key (customer_id) references customer(customer_id)
);

create table promotions(
    email varchar(255) primary key,
    customer_id uuid,
    foreign key (customer_id) references customer(customer_id)
)

CREATE OR REPLACE FUNCTION check_booking_collision()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for overlapping dates with same vehicle_number and status 'accepted'
    IF EXISTS (
        SELECT 1
        FROM booking
        WHERE vehicle_number = NEW.vehicle_number
          AND booking_status = 'Accepted'
          AND (
              (NEW.start_date::DATE, NEW.end_date::DATE) OVERLAPS (start_date::DATE, end_date::DATE)
          )
          AND booking_id != NEW.booking_id -- Exclude the current booking itself
    ) THEN
        RAISE EXCEPTION 'Cannot change status to "complete" due to overlapping booking with status "accepted"';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_booking_status
BEFORE UPDATE ON booking
FOR EACH ROW
WHEN (OLD.booking_status = 'pending' AND NEW.booking_status = 'Accepted')
EXECUTE FUNCTION check_booking_collision();

