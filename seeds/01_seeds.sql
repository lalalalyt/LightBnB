INSERT INTO users (name, email, password)
VALUES('Teemo', 'Teemo@lol.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Tryn', 'Tryn@lol.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ashe', 'Ashe@lol.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url,cover_photo_url, cost_per_night, country, street, city, province, post_code)
VALUES (1, 'Mushroom', 'description', 'nice.home1.ca', 'nice.home2.ca', 200, 'Canada','1st avenue', 'Montreal', 'QC', 'H2H P2P'),
(2, 'Kingdom', 'description', 'nice.home3.ca', 'nice.home4.ca', 400, 'USA','2nd avenue', 'New York', 'NY', '123HU'),
(3, 'Heaven', 'description', 'nice.home5.ca', 'nice.home6.ca', 300, 'China','Big avenue', 'Beijing', 'BJ', '112345');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (guest_id, property_id,reservation_id,rating,message)
VALUES (1, 1, 1, 4, 'message'),
(2, 2, 2, 3, 'message'),
(3, 3, 3, 5, 'message');


