// ListComponentを作成

// アイコンインポート
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon, MinusSmallIcon } from "@heroicons/react/24/solid";
// storeインポート
import { useStore } from "../store/store";
// typeインポート
import { TodoItem } from "../types/TodoItem";
import { TodoList } from "../types/TodoList";
// コンポーネントインポート
import Button from "./Button";
import Input from "./Input";
import DeleteListModal from "./DeleteListModal";
import RenameListModal from "./RenameListModal";
import { useState } from "react";


// TodoItem
type TodoItemProps = {
    onDelete: (todoItemId: number) => void,
    onUpdateComplete: (todoItemId: number, complete: boolean) => void,
    onRename: (todoItemId: number, newTodoItemText: string) => void,
    todoItem: TodoItem,
}

function TodoItemComponent(props: TodoItemProps) {
    const { onDelete, onUpdateComplete, onRename, todoItem } = props;

    const [isEditing, setIsEditig] = useState(false);
    const [editedText, setEditedText] = useState(todoItem.text);

    // // 編集モード
    const handleEditClick = () => {
        setIsEditig(true);
    }

    function handleOnEditTodoText(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (editedText.length > 0) {
            onRename(todoItem.id, editedText);
            setIsEditig(false);
        }
    }

    return (
      <div className="flex flex-row gap-2 items-center">
        <Button 
          className="h-7 p-0 w-7"
          icon={todoItem.complete ? <CheckIcon className="h-4 w-4"/> : undefined}
          onClick={() => onUpdateComplete(todoItem.id, !todoItem.complete)} //!で反転させる
          variant={todoItem.complete ? 'success' : 'default'}
        />

        {isEditing ? (
          <form
            className="grow" 
            onSubmit={(e) => handleOnEditTodoText(e)}>
              <Input
                onChange={(v) => setEditedText(v)}
                placeholder="new todo text..."
                value={editedText}
              />
          </form>
        ) : (
          <p className="grow" onClick={() => handleEditClick()}>
            {todoItem.text}
          </p> 
        )}

        <Button 
          icon={<MinusSmallIcon className="h-4 w-4" />}
          onClick={() => onDelete(todoItem.id)}
          variant="ghost"
        />
      </div>
    )
}

// TodoList
type TodoListProps = {
    todoList: TodoList,
}

export default function TodoListComponent(props: TodoListProps) {
    const { todoList } = props;

    // Listで操作できること
    // onRenameTodoListにカスタムフックとして登録したrenameTodoListを格納
    const onRenameTodoList = useStore((store) => store.renameTodoList);
    const onDeleteTodoList = useStore((store) => store.deleteTodoList);
    const onCreateTodoItem = useStore((store) => store.createTodoItem);
    const onDeleteTodoItem = useStore((store) => store.deleteTodoItem);
    const onUpdateTodoItemComplete = useStore((store) => store.updateTodoItemComplete);
    const onRenameTodoItem = useStore((store) => store.renameTodoItem);

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
              onDelete={(todoItemId: number) => 
                onDeleteTodoItem(todoList.id, todoItemId)
              }
              onUpdateComplete={(todoItemId: number, complete: boolean) => 
                onUpdateTodoItemComplete(todoList.id, todoItemId, complete)
              }
              onRename={(todoItemId: number, newTodoItemText: string) => 
                onRenameTodoItem(todoList.id, todoItemId, newTodoItemText)
              }
              todoItem={todoItem}
            />
          ))}
        </div>
        {/* 下段のform */}
        <form 
            className="border border-gray-100 dark:border-slate-700 flex flex-row py-4 rounted-md shadow-sm"
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
          onDelete={() => onDeleteTodoList(todoList.id)}
        />
      </div>
    )
}