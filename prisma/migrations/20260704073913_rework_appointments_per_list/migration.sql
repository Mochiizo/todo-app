/*
  Warnings:

  - You are about to drop the column `start_at` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `client_first_name` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_last_name` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_list_id` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "start_at",
DROP COLUMN "title",
ADD COLUMN     "client_first_name" TEXT NOT NULL,
ADD COLUMN     "client_last_name" TEXT NOT NULL,
ADD COLUMN     "task_list_id" INTEGER NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_task_list_id_fkey" FOREIGN KEY ("task_list_id") REFERENCES "task_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
