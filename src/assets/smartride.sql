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
  PRIMARY KEY (`user_id`),
  UNIQUE (`email`),
  UNIQUE (`username`),
  UNIQUE (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `username`, `role`,`phone_number`, `password`) VALUES
(1, 'admin@gmail.com', 'admin', 'Admin', '0123456789', '$2b$10$8RZiEPxolfO5U4vl.mw59u1rSqjDUXdAj/OosfZeLhkNRmhQG0kpO');