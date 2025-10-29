CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`category` enum('M&A Strategy','FP&A','PMI','Working Capital','Pricing Strategy') NOT NULL,
	`primaryKeyword` varchar(255) NOT NULL,
	`secondaryKeywords` text NOT NULL,
	`metaDescription` varchar(160) NOT NULL,
	`featuredImage` varchar(500),
	`author` varchar(100) NOT NULL DEFAULT 'ApexDeliver Team',
	`readingTime` int NOT NULL DEFAULT 10,
	`published` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(255),
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
