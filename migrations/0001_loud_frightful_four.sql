CREATE TABLE `leaderboard` (
	`id` integer PRIMARY KEY NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
