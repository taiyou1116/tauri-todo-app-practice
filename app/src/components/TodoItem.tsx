import { CheckIcon, ClockIcon, MinusSmallIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { TodoItem } from "../types/TodoItem";

import Input from "./Input";
import Button from "./Button";
import DeadlineModal from "./DeadlineModal";

type TodoItemProps = {
    onDelete: (todoItemId: number) => void,
    onUpdateComplete: (todoItemId: number, complete: boolean) => void,
    onRename: (todoItemId: number, newTodoItemText: string) => void,
    onDeadline: (todoItemId: number, deadline: Date) => void,
    todoItem: TodoItem,
}

export default function TodoItemComponent(props: TodoItemProps) {
    const { onDelete, onUpdateComplete, onRename, onDeadline, todoItem } = props;

    // todoItemTextの変更
    const [isEditing, setIsEditig] = useState(false);
    const [editedText, setEditedText] = useState(todoItem.text);

    // Modalの状態管理
    const [deadlineModalOpen, setDeadlineModalOpen] = useState(false);

    const handleEditClick = () => {
        setEditedText(todoItem.text);
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
        
        {/* 値が入っていたら */}
        {todoItem.deadline ? (
          <p 
            onClick={() => setDeadlineModalOpen(true)}
            className="cursor-pointer flex items-center"
          >
            { todoItem.deadline.getTime() < Date.now() ? <ExclamationTriangleIcon className="h-4 w-4" /> : "" }
            { todoItem.deadline.toLocaleString() }
          </p>
        ) : 
          <Button 
            icon={<ClockIcon className="h-4 w-4" />}
            onClick={() => setDeadlineModalOpen(true)}
            variant="ghost"
        />}

        <Button 
          icon={<MinusSmallIcon className="h-4 w-4" />}
          onClick={() => onDelete(todoItem.id)}
          variant="ghost"
        />

        {/* ModalOpen */}
        <DeadlineModal 
          open={deadlineModalOpen}
          onClose={() => setDeadlineModalOpen(false)}
          onSetDeadline={(deadline) => onDeadline(todoItem.id, deadline)}
        />
      </div>
    )
}