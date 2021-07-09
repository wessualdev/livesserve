-- -----------------------------------------------------
-- Table `company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `company` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `abbreviation` VARCHAR(10) NOT NULL,
  `primary_color` VARCHAR(15) NOT NULL,
  `secondary_color` VARCHAR(15) NOT NULL,
  `terciary_color` VARCHAR(15) NOT NULL,
  `logo` VARCHAR(100) NOT NULL,
  `passed_poster` VARCHAR(100) NULL,
  `inactive_poster` VARCHAR(100) NULL,
  `default_poster` VARCHAR(100) NULL,
  `copyright` TEXT NULL,
  `custom_css` TEXT NOT NULL,
  `active` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `congress`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `congress` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `company_id` INT NOT NULL,
  `date` TIMESTAMP NOT NULL,
  `init_date` TIMESTAMP NULL,
  `end_date` TIMESTAMP NULL,
  `active` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_congress_company1`
    FOREIGN KEY (`company_id`)
    REFERENCES `company` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(1) NOT NULL DEFAULT '2',
  `token` VARCHAR(128) NOT NULL,
  `added` TIMESTAMP NOT NULL,
  `active` TINYINT NOT NULL,
  `url_back` VARCHAR(255) NULL,
  `url_front` VARCHAR(255) NULL,
  `company_id` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_users_company1`
    FOREIGN KEY (`company_id`)
    REFERENCES `company` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `lives`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `lives` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `speaker` TEXT NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `warning` TEXT NULL,
  `program` TEXT NULL,
  `survey` VARCHAR(255) NULL,
  `chat` TINYINT NOT NULL DEFAULT 0,
  `date` TIMESTAMP NULL,
  `init_time` TIME NULL,
  `end_time` TIME NULL,
  `added` TIMESTAMP NULL,
  `updated` TIMESTAMP NULL,
  `support` INT NULL,
  `company_id` INT NOT NULL,
  `congress_id` INT NULL,
  `type` ENUM('face', 'facezoom', 'livezoom', 'zoom', 'zoomweb', 'podcast') NOT NULL,
  `active` TINYINT NULL DEFAULT 1,
  `url_front` VARCHAR(255) NULL,
  `url_back` VARCHAR(255) NULL,
  `url_zoom` VARCHAR(255) NULL,
  `copyright` TEXT NULL,
  `logo_patro` VARCHAR(255) NULL,
  `logo_company_alt` VARCHAR(255) NULL,
  `podcast_poster_img` VARCHAR(255) NULL,
  `passed_poster_alt` VARCHAR(255) NULL,
  `inactive_poster_alt` VARCHAR(255) NULL,
  `video_poster` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_lives_company1`
    FOREIGN KEY (`company_id`)
    REFERENCES `company` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_lives_congress1`
    FOREIGN KEY (`congress_id`)
    REFERENCES `congress` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_lives_users1`
    FOREIGN KEY (`support`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lives_id` INT NOT NULL,
  `time` TIMESTAMP NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `ip` VARCHAR(20) NOT NULL,
  `message` TEXT NOT NULL,
  `visible` TINYINT NOT NULL DEFAULT 1,
  `type` INT(1) NOT NULL DEFAULT 0 COMMENT '0-Pregunta\n1-Incidencia',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_chat_lives1`
    FOREIGN KEY (`lives_id`)
    REFERENCES `lives` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `issue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `issue` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lives_id` INT NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `date` TIMESTAMP NOT NULL,
  `message` TEXT NOT NULL,
  `visible` TINYINT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_issue_lives1`
    FOREIGN KEY (`lives_id`)
    REFERENCES `lives` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tracking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tracking` (
  `id` INT NOT NULL,
  `lives_id` INT NOT NULL,
  `session_id` VARCHAR(45) NULL,
  `quality` VARCHAR(10) NULL,
  `language` VARCHAR(10) NULL DEFAULT 'es',
  `trackingcol` VARCHAR(45) NULL,
  `GWET_name` VARCHAR(255) NULL,
  `GWET_lastName` VARCHAR(255) NULL,
  `GWET_MCID` VARCHAR(255) NULL,
  `GWET_email_id` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tracking_lives1`
    FOREIGN KEY (`lives_id`)
    REFERENCES `lives` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
