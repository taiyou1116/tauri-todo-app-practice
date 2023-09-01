import { Toaster } from "react-hot-toast";

// Components
import Sidebar from "./components/Sidebar";
import TodoListComponent from "./components/TodoList";
// store
import { useStore } from "./store/store";
import { useEffect } from "react";

export default function App() {
    const getTodoLists = useStore((state) => state.getTodoLists);
    const todoLists = useStore((state) => state.todoLists);
    const selectedTodoList = useStore((state) => state.selectedTodoList);
    const selectTodoList = useStore((state) => state.selectTodoList);
    const setTheme = useStore((state) => state.setTheme);

    useEffect(() => {
        getTodoLists();
        setTheme();
    }, [])

    // ?
    useEffect(() => {
        // selectされているListが存在するならば
        if (selectedTodoList) {
          selectTodoList(
            todoLists.find((todoList) => todoList.id === selectedTodoList.id) ?? 
            null
          )
        }
    }, [todoLists])

  return (
    <div >
      <div className="bg-gray-50 dark:bg-slate-800 dark:text-white flex flex-row h-screen w-screen">
        <Sidebar />
        {/* todoListが選択されている場合は、右側にtodoListを表示する */}
        {selectedTodoList && <TodoListComponent todoList={selectedTodoList} />}
        {!selectedTodoList && (
          <div className="flex grow h-full justify-center items-center">
            <p className="font-midium text-lg">Select a list</p>
          </div>
        )}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            className:'bg-gray-50 dark:bg-slate-600 dark:text-white rounded-md shadow-md'
          }}
        />
      </div>
    </div>
  );
}
