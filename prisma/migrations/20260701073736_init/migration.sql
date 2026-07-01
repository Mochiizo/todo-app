-- CreateTable
CREATE TABLE "task_lists" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "task_list_id" INTEGER NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_task_list_id_fkey" FOREIGN KEY ("task_list_id") REFERENCES "task_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
