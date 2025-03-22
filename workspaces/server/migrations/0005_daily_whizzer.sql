CREATE INDEX `episode_series_id_order_idx` ON `episode` (`seriesId`,`order`);--> statement-breakpoint
CREATE INDEX `program_start_at_idx` ON `program` (`startAt`);--> statement-breakpoint
CREATE INDEX `recommended_item_module_id_order_idx` ON `recommendedItem` (`moduleId`,`order`);--> statement-breakpoint
CREATE INDEX `recommended_module_reference_id_order_idx` ON `recommendedModule` (`referenceId`,`order`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `user` (`email`);