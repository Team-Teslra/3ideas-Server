'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER NOT NULL auto_increment , `userName` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `point` INTEGER NOT NULL DEFAULT 0, `report` INTEGER NOT NULL DEFAULT 0, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
      {
        type: Sequelize.QueryTypes.RAW,
      },
    );

    await queryInterface.sequelize.query(
      'CREATE TABLE IF NOT EXISTS `questions` (`id` INTEGER NOT NULL auto_increment , `title` VARCHAR(255) NOT NULL, `contents` TEXT NOT NULL, `questionFlag` TINYINT(1) NOT NULL DEFAULT true, `user_id` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;',
      {
        type: Sequelize.QueryTypes.RAW,
      },
    );

    await queryInterface.sequelize.query(
      'CREATE TABLE IF NOT EXISTS `answers` (`id` INTEGER NOT NULL auto_increment , `contents` TEXT NOT NULL, `answerFlag` VARCHAR(255), `user_id` INTEGER NOT NULL, `question_id` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;',
      {
        type: Sequelize.QueryTypes.RAW,
      },
    );

    await queryInterface.sequelize.query(
      'CREATE TABLE IF NOT EXISTS `blacklist` (`id` INTEGER NOT NULL auto_increment , `token` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
      {
        type: Sequelize.QueryTypes.RAW,
      },
    );

    await queryInterface.sequelize.query(
      'CREATE TABLE IF NOT EXISTS `categories` (`id` INTEGER NOT NULL auto_increment , `categoryName` VARCHAR(255) NOT NULL UNIQUE, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
      {
        type: Sequelize.QueryTypes.RAW,
      },
    );

    await queryInterface.sequelize.query(
      'CREATE TABLE IF NOT EXISTS `category_question` (`id` INTEGER NOT NULL auto_increment , `question_id` INTEGER NOT NULL, `category_id` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;',
      {
        type: Sequelize.QueryTypes.RAW,
      },
    );

    await queryInterface.sequelize.query(
      'CREATE TABLE IF NOT EXISTS `user_like` (`id` INTEGER NOT NULL auto_increment , `answer_id` INTEGER NOT NULL, `user_id` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;',
      {
        type: Sequelize.QueryTypes.RAW,
      },
    );

    return;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP TABLE `user_like`', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('DROP TABLE `category_question`', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('DROP TABLE `categories`', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('DROP TABLE `blacklist`', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('DROP TABLE `answers`', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('DROP TABLE `questions`', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('DROP TABLE `users`', {
      type: Sequelize.QueryTypes.RAW,
    });

    return;
  },
};
