--
-- Database: `smartride`
--
--
-- Table structure for table `users`
--

CREATE TABLE users (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` VARCHAR(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` ENUM('admin', 'customer', 'driver') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE (`email`),
  UNIQUE (`username`),
  UNIQUE (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `drivers_details`
--

CREATE TABLE drivers_details (
  `driver_id` int(11) NOT NULL,
  `id_card` VARCHAR(255),
  `driver_license` VARCHAR(255),
  `insurance_document` VARCHAR(255),
  `license_plate` VARCHAR(20),
  `vehicle_type` ENUM('car', 'motorbike'),
  `vehicle_color` ENUM('black', 'white', 'other'),
  `is_verified` BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (`driver_id`),
  FOREIGN KEY (`driver_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `rides`
--

CREATE TABLE rides (
  ride_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_type VARCHAR(50),
  pickup_location VARCHAR(255),
  dropoff_location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  distance_km FLOAT,
  duration_min FLOAT,
  eta DATETIME,
  payment_method VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

--
-- Table structure for table `payments`
--

CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(50),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(ride_id) ON DELETE CASCADE
);

--
-- Table structure for table `problems`
--

CREATE TABLE problems (
  problem_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  ride_id INT DEFAULT NULL,
  description TEXT NOT NULL,
  status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (ride_id) REFERENCES rides(ride_id) ON DELETE SET NULL
);

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `phone_number`, `password`, `role`) VALUES
(1, 'admin', 'admin@gmail.com', '0123456789', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO', 'admin'),
(2, 'driver', 'driver@gmail.com', '0123456788', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO', 'driver'),
(3, 'driver2', 'driver2@gmail.com', '0123456787', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO', 'driver'),
(4, 'driver3', 'driver3@gmail.com', '0123456786', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO', 'driver'),
(5, 'driver4', 'driver4@gmail.com', '0123456785', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO', 'driver'),
(6, 'driver5', 'driver5@gmail.com', '0123456784', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO', 'driver');

--
-- Dumping data for table `drivers_details`
--

INSERT INTO `drivers_details` (`driver_id`, `id_card`, `driver_license`, `insurance_document`, `license_plate`, `vehicle_type`, `vehicle_color`, `is_verified`) VALUES
(2, 'uploads/2-driver-license.jpg', 'uploads/2-driver-license.jpg', 'uploads/2-insurance-document.jpg', '29A-135.67', 'car', 'black', 0),
(3, 'uploads/3-id-card.jpg', 'uploads/3-driver-license.jpg', 'uploads/3-insurance-document.jpg', '29B-246.89', 'motorbike', 'white', 1),
(4, 'uploads/4-id-card.jpg', 'uploads/4-driver-license.jpg', 'uploads/4-insurance-document.jpg', '30C-357.90', 'car', 'other', 0),
(5, 'uploads/5-id-card.jpg', 'uploads/5-driver-license.jpg', 'uploads/5-insurance-document.jpg', '31D-468.12', 'motorbike', 'black', 1),
(6, 'uploads/6-id-card.jpg', 'uploads/6-driver-license.jpg', 'uploads/6-insurance-document.jpg', '32E-579.34', 'car', 'white', 0);