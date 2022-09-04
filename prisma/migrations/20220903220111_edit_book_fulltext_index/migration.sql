-- CreateIndex
CREATE FULLTEXT INDEX `Book_name_author_description_idx` ON `Book`(`name`, `author`, `description`);
