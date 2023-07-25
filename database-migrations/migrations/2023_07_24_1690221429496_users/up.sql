-- Add migration UP SQL statements.
CREATE TABLE `user_t` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `currency_t` (
  `id` varchar(36) NOT NULL,
  `code` varchar(3) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `address_t` (
  `id` varchar(36) NOT NULL,
  `country` varchar(255) NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `candidate_t` (
  `id` varchar(36) NOT NULL,
  `owner_id` varchar(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `department` varchar(255) NOT NULL,
  `min_salary_expectation` decimal(10,2) NOT NULL,
  `max_salary_expectation` decimal(10,2) NOT NULL,
  `currency_id` varchar(36) NOT NULL,
  `address_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `currency_id` (`currency_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `candidate_t_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `user_t` (`id`),
  CONSTRAINT `candidate_t_ibfk_2` FOREIGN KEY (`currency_id`) REFERENCES `currency_t` (`id`),
  CONSTRAINT `candidate_t_ibfk_3` FOREIGN KEY (`address_id`) REFERENCES `address_t` (`id`)
);
CREATE TABLE `education_t` (
  `id` varchar(36) NOT NULL,
  `candidate_id` varchar(36) NOT NULL,
  `school` varchar(100) NOT NULL,
  `degree` varchar(100) NOT NULL,
  `major` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `education_t_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_t` (`id`)
);

CREATE TABLE `experience_t` (
  `id` varchar(36) NOT NULL,
  `candidate_id` varchar(36) NOT NULL,
  `company` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `years` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `experience_t_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_t` (`id`)
);

CREATE TABLE `phone_number_t` (
  `id` varchar(36) NOT NULL,
  `candidate_id` varchar(36) NOT NULL,
  `type` varchar(50) NOT NULL,
  `number` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `phone_number_t_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_t` (`id`)
);

CREATE TABLE `skill_t` (
  `id` varchar(36) NOT NULL,
  `candidate_id` varchar(36) NOT NULL,
  `skill` varchar(100) NOT NULL,
  `level` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `skill_t_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_t` (`id`)
);

