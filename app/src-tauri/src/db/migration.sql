-- dbにはTodoListとTodoItemがテーブルとして存在する
-- CreateTable
CREATE TABLE IF NOT EXISTS "TodoList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "TodoItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoListId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "deadline" DATETIME,
    CONSTRAINT "TodoItem_todoListId_fkey" FOREIGN KEY ("todoListId") REFERENCES "TodoList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);