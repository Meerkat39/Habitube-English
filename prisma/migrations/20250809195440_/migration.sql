/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Achievement_userId_date_key" ON "Achievement"("userId", "date");
