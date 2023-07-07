INSERT INTO users (name, email, password)
VALUES ('Jane', 'jane@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Kirsten', 'ksmith@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Henry', 'henry@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, 
country, street, city, province, post_code, active)
VALUES (1, 'Cozy Cottage Retreat', 'A charming cottage nestled in the woods, perfect for a peaceful getaway.', 'https://example.com/thumbnails/cozy_cottage.jpg', 'https://example.com/covers/cozy_cottage.jpg', 100, 2, 1, 2, 'United States', '123 Oak Street', 'Countryside', 'California', '90210', true),
(2, 'Luxurious Beachfront Villa', 'An exquisite villa with breathtaking ocean views, perfect for a luxurious vacation.', 'https://example.com/thumbnails/beachfront_villa.jpg', 'https://example.com/covers/beachfront_villa.jpg', 500, 3, 4, 5, 'Mexico', '456 Palm Avenue', 'Seaside', 'Quintana Roo', '77777', true),
(3, 'Modern Urban Loft', 'A stylish loft located in the heart of the city, ideal for urban living.', 'https://example.com/thumbnails/urban_loft.jpg', 'https://example.com/covers/urban_loft.jpg', 200, 1, 2, 1, 'Canada', '789 Main Street', 'Metropolis', 'Ontario', '12345', false);


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2023-07-01', '2023-07-07', 1, 1),
('2023-07-15', '2023-07-22', 2, 2),
('2023-08-01', '2023-08-07', 3, 3);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 10, 4.5, 'Great experience! Highly recommended.'),
(2, 2, 11, 5.0, 'Absolutely loved it! Exceeded expectations.'),
(3, 3, 12, 3.8, 'Decent stay. Room for improvement.');
