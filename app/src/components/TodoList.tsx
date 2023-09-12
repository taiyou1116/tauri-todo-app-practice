// アイコンインポート
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
// storeインポート
import { useStore } from "../store/store";
// typeインポート
import { TodoList } from "../types/TodoList";
// コンポーネントインポート
import Button from "./Button";
import Input from "./Input";
import TodoItemComponent from "./TodoItem";
import DeleteListModal from "./DeleteListModal";
import RenameListModal from "./RenameListModal";
import { useState } from "react";

type TodoListProps = {
    todoList: TodoList,
}

export default function TodoListComponent(props: TodoListProps) {
    const { todoList } = props;

    // カスタムフック
    const onRenameTodoList = useStore((store) => store.renameTodoList);
    const onDeleteTodoList = useStore((store) => store.deleteTodoList);
    const onCreateTodoItem = useStore((store) => store.createTodoItem);
    const onDeleteTodoItem = useStore((store) => store.deleteTodoItem);
    const onUpdateTodoItemComplete = useStore((store) => store.updateTodoItemComplete);
    const onRenameTodoItem = useStore((store) => store.renameTodoItem);
    const onDeadlineTodoItem = useStore((store) => store.deadlineTodoItem);
    const onGetTodoItemDeadline = useStore((store) => store.getTodoItemDeadline);

    // ModalDialogの状態(表示、非表示)を管理
    const [renameListModalOpen, setRenameListModalOpen] = useState(false);
    const [deleteListModalOpen, setDeleteListModalOpen] = useState(false);
    const [newTodoItemText, setNewTodoItemText] = useState('');

    function handleOnCreateTodoItem(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (newTodoItemText.length > 0) {
            onCreateTodoItem(todoList.id, newTodoItemText);
            setNewTodoItemText('');
        }
    }

    async function handleDeleteTodoItem(todoItemId: number) {
        try {
            await onDeleteTodoItem(todoList.id, todoItemId);
            // deadlineTodoItemの処理が完了した後にgetTodoItemDeadlineを実行
            await onGetTodoItemDeadline();
        } catch (error) {
            console.error(`An error occurred: ${error}`);
        }
    }

    async function handleDeleteTodoList() {
        try {
            await onDeleteTodoList(todoList.id);
            // deadlineTodoItemの処理が完了した後にgetTodoItemDeadlineを実行
            await onGetTodoItemDeadline();
        } catch (error) {
            console.error(`An error occurred: ${error}`);
        }
    }

    async function handleDeadlineTodoItemAndFetchDeadlines
        (listId: number, todoId: number, deadline: Date) {
        try {
            await onDeadlineTodoItem(listId, todoId, deadline);
            // deadlineTodoItemの処理が完了した後にgetTodoItemDeadlineを実行
            await onGetTodoItemDeadline();
        } catch (error) {
            console.error(`An error occurred: ${error}`);
        }
    }

    return (
      <div className="flex flex-col grow px-4 py-2">
        {/* 上部のヘッダー */}
        <div className="flex flex-row justify-between">
          <Button 
            icon={<PencilIcon className="h-4 w-4" />}
            onClick={() => setRenameListModalOpen(true)}
          />
          <p className="font-medium ml-4 text-center text-2xl">{todoList.name}</p>
          <Button 
            icon={<TrashIcon className="h-4 w-4" />}
            onClick={() => setDeleteListModalOpen(true)}
          />
        </div>
        {/* 中央のアイテムたち */}
        <div className="flex flex-col gap-4 grow my-4 overflow-y-auto">
          {/* .map(() => {})...値を返さない  .map(() => ())...値を返す */}
          {todoList.todos.map((todoItem) => (
            <TodoItemComponent
              key={todoItem.id}
              onDelete={(todoItemId: number) => 
                handleDeleteTodoItem(todoItemId)
              }
              onUpdateComplete={(todoItemId: number, complete: boolean) => 
                onUpdateTodoItemComplete(todoList.id, todoItemId, complete)
              }
              onRename={(todoItemId: number, newTodoItemText: string) => 
                onRenameTodoItem(todoList.id, todoItemId, newTodoItemText)
              }
              onDeadline={(todoItemId: number, deadline: Date) => 
                handleDeadlineTodoItemAndFetchDeadlines(todoList.id, todoItemId, deadline)
              }
              todoItem={todoItem}
            />

          ))}
        </div>
        {/* 下段のform */}
        <form 
            className="border border-gray-100 dark:border-slate-700 flex flex-row p-4 rounted-md shadow-sm"
            onSubmit={(e) => handleOnCreateTodoItem(e)}
          >
          <Input 
            onChange={(v) => setNewTodoItemText(v)}
            placeholder="Create a new to-do..."
            value={newTodoItemText}
          />
          <Button 
            className="ml-2"
            icon={<CheckIcon className="h-4 w-4" />}
            type="submit"
            variant="primary"
          />
        </form>
        {/* ModalDialog */}
        <RenameListModal 
          open={renameListModalOpen}
          onClose={() => setRenameListModalOpen(false)}
          onRename={(newName) => onRenameTodoList(todoList.id, newName)}
        />
        <DeleteListModal 
          open={deleteListModalOpen}
          onClose={() => setDeleteListModalOpen(false)}
          onDelete={() => handleDeleteTodoList()}
        />
      </div>
    )
}