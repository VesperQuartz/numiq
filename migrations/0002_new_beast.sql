ALTER TABLE `question` ADD `explanation` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `leaderboard_user_id_unique` ON `leaderboard` (`user_id`);