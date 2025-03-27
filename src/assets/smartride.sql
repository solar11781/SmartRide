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
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `phone_number`, `password`, `role`) VALUES
(1, 'admin', 'admin@gmail.com', '0123456789', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO', 'admin'),
(2, 'driver', 'driver@gmail.com', '0123456788', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO', 'driver');

--
-- Dumping data for table `drivers_details`
--

INSERT INTO `drivers_details` (`driver_id`, `id_card`, `driver_license`, `insurance_document`, `license_plate`, `vehicle_type`, `vehicle_color`, `is_verified`) VALUES
(2, 'uploads/2-driver-license.jpg', 'uploads/2-driver-license.jpg', 'uploads/2-insurance-document.jpg', '29A-135.67', 'car', 'black', 0);