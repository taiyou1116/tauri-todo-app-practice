// Sidebarコンポーネントを作成...Listの作成を行う

import { MoonIcon, PlusIcon, SunIcon } from "@heroicons/react/24/outline";

import { useStore } from "../store/store"
import { TodoList } from "../types/TodoList";
import Button from "./Button";
import CreateListModal from "./CreateListModal";
import { useState } from "react";

import { toast } from "react-hot-toast";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";

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

// 通知を表示する関数を定義
const notify = () => {
  toast.success('これはデスクトップ通知です！');
  
  const testNotification = async () => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
      try {
        await sendNotification('Tauri is awesome!');
        await sendNotification({ title: 'TAURI', body: 'Tauri is awesome!' });
        console.log("成功");
      } catch (error) {
        console.log(error);
      }
    }
  }
  testNotification();
};

export default function Sidebar() {
    const todoLists = useStore((store) => store.todoLists);
    const selectedTodoList = useStore((store) => store.selectedTodoList);
    const onCreateTodoList = useStore((store) => store.createTodoList);
    const onSelectTodoList = useStore((store) => store.selectTodoList);
    const onGetTodoItemsDeadline = useStore((store) => store.getTodoItemDeadline);
    const theme = useStore((store) => store.theme);
    const setTheme = useStore((store) => store.setTheme);

    const [createListModalOpen, setCreateListModalOpen] = useState(false);

    return (
      <div className="border-gray-100 border-r dark:border-slate-900 flex flex-col max-w-lg min-w-[200px] py-2 w-1/4">
        <div className="flex flex-row justify-between mb-2 px-4">
          <p className="flex font-medium self-end text-lg">Lists</p>
          <Button 
            icon={<PlusIcon className="h-[22px] w-[16px]" />}
            onClick={() => {
              console.log("button");
              setCreateListModalOpen(true)}}
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
        <button onClick={() => onGetTodoItemsDeadline()}>通知を表示</button>
      </div>
    )
}