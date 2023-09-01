// Sidebarコンポーネントを作成...Listの作成を行う

import { MoonIcon, PlusIcon, SunIcon } from "@heroicons/react/24/outline";

import { useStore } from "../store/store"
import { TodoList } from "../types/TodoList";
import Button from "./Button";
import CreateListModal from "./CreateListModal";
import { useState } from "react";

type SliderListItemProps = {
    count: number,
    onClick: () => void,
    name: string,
    selected: boolean,
}

// 一つのスライドアイテム
function SidebarListItem(props: SliderListItemProps) {
    const { count, onClick, name, selected } = props;

    const classes = `cursor-pointer mx-2 rounded-md ${
        selected
            ? `bg-gray-200 dark:bg-slate-600`
            : `hover:bg-gray-100 hover:dark:bg-slate-700`
    }`;

    return (
      <div className={classes} onClick={() => onClick()}>
        <div className="flex justify-between px-2 py-1">
          <div>{name}</div>
          <div className="my-auto text-sm">{count}</div>
        </div>
      </div>
    )
}

export default function Sidebar() {
    const todoLists = useStore((state) => state.todoLists);
    const selectedTodoList = useStore((state) => state.selectedTodoList);
    const onCreateTodoList = useStore((state) => state.createTodoList);
    const onSelectTodoList = useStore((state) => state.selectTodoList);
    const theme = useStore((state) => state.theme);
    const setTheme = useStore((state) => state.setTheme);

    const [createListModalOpen, setCreateListModalOpen] = useState(false);

    return (
      <div className="border-gray-100 border-r dark:border-slate-900 flex flex-col max-w-lg min-w-[200px] py-2 w-1/4">
        <div className="flex flex-row justify-between mb-2 px-4">
          <p className="flex font-medium self-end text-lg">Lists</p>
          <Button 
            icon={<PlusIcon className="h-[22px] w-[16px]" />}
            onClick={() => setCreateListModalOpen(true)}
          />
        </div>
        {/* Dialog */}
        <CreateListModal
          onClose={() => setCreateListModalOpen(false)}
          onCreate={(name) => onCreateTodoList(name)}
          open={createListModalOpen}
        />
        <div className="flex flex-col gap-2 grow overflow-auto">
          {todoLists.map((todoList: TodoList) => (
            <SidebarListItem 
            // ``で変数を組み込める
              key={`sidebar-item-${todoList.id}`}
              count={todoList.todos.length}
              onClick={() => onSelectTodoList(todoList)}
              name={todoList.name}
              selected={selectedTodoList === todoList}
            />
          ))}
        </div>
        {/* theme */}
        <div className="flex flex-row px-2">
          {theme === 'dark' && (
            <Button 
              icon={<SunIcon className="h-6 w-4" />}
              onClick={() => setTheme('light')}
            />
          )}
          {theme === 'light' && (
            <Button 
              icon={<MoonIcon className="h-6 w-4" />}
              onClick={() => setTheme('dark')}
            />
          )}
        </div>
      </div>
    )
}