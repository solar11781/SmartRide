--
-- Database: `smartride`
--
--
-- Table structure for table `users`
--

CREATE TABLE users (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `role` ENUM('customer', 'driver', 'admin') NOT NULL,
  `phone_number` VARCHAR(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `verified` BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE (`email`),
  UNIQUE (`username`),
  UNIQUE (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE rides (
  ride_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_type VARCHAR(20),
  pickup_location VARCHAR(255),
  dropoff_location VARCHAR(255),
  status ENUM('Pending', 'Accepted', 'Completed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  ride_id INT,
  amount DECIMAL(10,2),
  method VARCHAR(50),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `username`, `role`,`phone_number`, `password`, `verified`) VALUES
(1, 'admin@gmail.com', 'admin', 'Admin', '0123456789', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO', 1);