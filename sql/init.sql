CREATE DATABASE CHATANDCALL;

USE CHATANDCALL;
SET NAMES utf8 ;

DROP TABLE IF EXISTS `users`;
SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `nick` varchar(20) NOT NULL,
  `mail` varchar(45) NOT NULL,
  `password` varchar(60) NOT NULL,
  PRIMARY KEY (`nick`),
  UNIQUE KEY `nick_UNIQUE` (`nick`),
  UNIQUE KEY `mail_UNIQUE` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `users` VALUES ('admin','admin@chatandcall.tk','$2b$12$0XHWIpabp7nCDp7EmZbEsOtdRshhLqqHcP4tgElcwd1UASoMnT7E.');

DROP TABLE IF EXISTS `channels`;
SET character_set_client = utf8mb4 ;
CREATE TABLE `channels` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(35) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  `admin` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_fk_idx` (`admin`),
  CONSTRAINT `admin_fk` FOREIGN KEY (`admin`) REFERENCES `users` (`nick`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `channels` VALUES (1,'General',1,'admin');

DROP TABLE IF EXISTS `access`;
SET character_set_client = utf8mb4 ;
CREATE TABLE `access` (
  `nick` varchar(20) NOT NULL,
  `id_channel` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`nick`,`id_channel`),
  KEY `id_channel_fk_idx` (`id_channel`),
  CONSTRAINT `id_channel_fk` FOREIGN KEY (`id_channel`) REFERENCES `channels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `nick_fk` FOREIGN KEY (`nick`) REFERENCES `users` (`nick`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `friends`;
SET character_set_client = utf8mb4 ;
CREATE TABLE `friends` (
  `nick1` varchar(20) NOT NULL,
  `nick2` varchar(20) NOT NULL,
  PRIMARY KEY (`nick1`,`nick2`),
  KEY `nick2_fk_idx` (`nick2`),
  CONSTRAINT `nick1_fk` FOREIGN KEY (`nick1`) REFERENCES `users` (`nick`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `nick2_fk` FOREIGN KEY (`nick2`) REFERENCES `users` (`nick`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `friendship_requests`;
SET character_set_client = utf8mb4 ;
CREATE TABLE `friendship_requests` (
  `from_nick` varchar(20) NOT NULL,
  `to_nick` varchar(20) NOT NULL,
  `status` enum('pending','rejected') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`from_nick`,`to_nick`),
  KEY `to_nick_fk_idx` (`to_nick`),
  CONSTRAINT `from_nick_fk` FOREIGN KEY (`from_nick`) REFERENCES `users` (`nick`) ON UPDATE CASCADE,
  CONSTRAINT `to_nick_fk` FOREIGN KEY (`to_nick`) REFERENCES `users` (`nick`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

