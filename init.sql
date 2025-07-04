DROP TABLE IF EXISTS `card_descriptions`;
DROP TABLE IF EXISTS `cards_logs`;
DROP TABLE IF EXISTS `cards`;

CREATE TABLE `cards` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `card_descriptions` (
  `id` VARCHAR(36) NOT NULL,
  `card_id` VARCHAR(36) NOT NULL,
  `description` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `card_id` (`card_id`),
  CONSTRAINT `card_descriptions_ibfk_1` FOREIGN KEY (`card_id`)
    REFERENCES `cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cards_logs` (
  `id` VARCHAR(36) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(36) NOT NULL,
  `old_data` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
    DEFAULT NULL CHECK (JSON_VALID(`old_data`)),
  `new_data` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
    DEFAULT NULL CHECK (JSON_VALID(`new_data`)),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
