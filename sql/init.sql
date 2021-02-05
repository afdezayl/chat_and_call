CREATE DATABASE IF NOT EXISTS chatandcall;

CREATE USER 'chatandcall'@'%' IDENTIFIED WITH mysql_native_password BY 'chatandcall';
GRANT ALL ON  chatandcall.* TO 'chatandcall'@'%';
FLUSH PRIVILEGES;

USE chatandcall;

DROP TABLE IF EXISTS `users`;
CREATE TABLE users (
  `login` varchar(20) NOT NULL,
  `mail` varchar(45) NOT NULL,
  `password` varchar(60) NOT NULL,
  PRIMARY KEY (`login`),
  UNIQUE KEY `mail_UNIQUE` (`mail`)
);
INSERT INTO `users` VALUES ('admin','admin@chatandcall.tk','$2b$12$0XHWIpabp7nCDp7EmZbEsOtdRshhLqqHcP4tgElcwd1UASoMnT7E.');

DROP TABLE IF EXISTS `channels`;

CREATE TABLE `channels` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(35) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);
INSERT INTO `channels` VALUES (1,'General',1);

DROP TABLE IF EXISTS `access`;
CREATE TABLE `access` (
  `login` varchar(20) NOT NULL,
  `id_channel` bigint(20) unsigned NOT NULL,
  `admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`login`,`id_channel`),
  KEY `id_channel_fk_idx` (`id_channel`),
  CONSTRAINT `id_channel_fk` FOREIGN KEY (`id_channel`) REFERENCES `channels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `login_fk` FOREIGN KEY (`login`) REFERENCES `users` (`login`) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO `access` VALUES ('admin',1,1);

DROP TABLE IF EXISTS `friends`;
CREATE TABLE `friends` (
  `login1` varchar(20) NOT NULL,
  `login2` varchar(20) NOT NULL,
  PRIMARY KEY (`login1`,`login2`),
  KEY `login2_fk_idx` (`login2`),
  CONSTRAINT `login1_fk` FOREIGN KEY (`login1`) REFERENCES `users` (`login`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `login2_fk` FOREIGN KEY (`login2`) REFERENCES `users` (`login`) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS `friendship_requests`;
CREATE TABLE `friendship_requests` (
  `from_login` varchar(20) NOT NULL,
  `to_login` varchar(20) NOT NULL,
  `status` enum('pending','rejected') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`from_login`,`to_login`),
  KEY `to_login_fk_idx` (`to_login`),
  CONSTRAINT `from_login_fk` FOREIGN KEY (`from_login`) REFERENCES `users` (`login`) ON UPDATE CASCADE,
  CONSTRAINT `to_login_fk` FOREIGN KEY (`to_login`) REFERENCES `users` (`login`) ON DELETE CASCADE
);
SELECT 'INITIAL SCRIPT -> OK';
