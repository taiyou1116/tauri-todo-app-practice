import toast from "react-hot-toast"; //通知を簡単に作成
import create from "zustand" //状態を関数で管理

import { invoke } from "@tauri-apps/api";

import { State } from "../types/State";
import { Theme } from "../types/Theme";
import { TodoItem } from "../types/TodoItem";
import { TodoList } from "../types/TodoList";
import { Result } from "../types/Result";

// 状態を管理するためのカスタムフック(setで状態を更新)
// ジェネリクスでStateタイプを宣言して、Stateプロパティのみをフックとして登録
export const useStore = create<State>((set, get) => ({
    todoLists: [],
    selectedTodoList: null,
    // Listを選択
    selectTodoList: (todoList: TodoList | null) => {
        set({ selectedTodoList: todoList });
    },
    // 全てのListを取得(もしget_todo_listsで帰ってきたのが、string(error)ならばそこで通知を出して、return)
    getTodoLists: async () => {
        const result: Result<TodoList[], string> = await invoke('get_todo_lists');
        if (typeof result === 'string') {
            toast.error(`Something went wrong: ${result}`);
            return;
        }
        set({ todoLists: result });
    },
    // Listの作成(TodoListを返す)
    createTodoList: async (name: string) => {
        const result: Result<TodoList, string> = await invoke("create_todo_list", {name});
        if (typeof result === "string") {
            toast.error(`Something went wrong: ${result}`);
            return;
        }
        set({
            // ...getでtodoListを全て取得し、第二引数にresultとし、最後の要素に追加
            todoLists: [...get().todoLists, result],
            // 現在選択しているListにresultをあてる
            selectedTodoList: result,
        });
    },
    deleteTodoList: async (listId: number) => {
        const result: Result<TodoList, string> = await invoke("delete_todo_list", {listId});
        if (typeof result === "string") {
            toast.error(`Something went wrong: ${result}`);
            return;
        }
        set({
            todoLists: [
                // idが合うものだけを除去
                // ...get()はtodoListsのコピーを作成し、その配列を新しいtodoListとして返す(コピー前の配列は自動的に解放される(GC))
                ...get().todoLists.filter((todoList) => todoList.id !== listId),
            ],
            selectedTodoList: null,
        });
    },
    renameTodoList: async (listId: number, newName: string) => {
        const result: Result<TodoList, string> = await invoke("rename_todo_list", {listId, newName});
        if (typeof result === "string") {
            toast.error(`Something went wrong: ${result}`);
            return;
        }
        set({
            todoLists: [
                // map関数は全ての要素を返す。全ての要素に対して処理を行う。今回はidがあう要素に対して、resultを格納
                ...get().todoLists.map((todoList) => {
                    if (todoList.id === listId) {
                        todoList = result;
                    }
                    return todoList;
                })
            ],
        })
    },
    createTodoItem: async (listId, todoText) => {
        const result: Result<TodoItem, string> = await invoke("create_todo_item", {listId, todoText});
        if (typeof result === "string") {
            toast.error(`Something went wrong: ${result}`);
            return;
        }
        set({
            todoLists: [
                ...get().todoLists.map((todoList) => {
                    if (todoList.id === listId) {
                        todoList.todos.push(result);
                    }
                    return todoList;
                })
            ]
        })
    },
    updateTodoItemComplete: async (listId: number, todoId: number, complete: boolean) => {
        const result: Result<TodoItem, string> = await invoke("update_todo_item_complete", {todoId, complete});
        if (typeof result === "string") {
            toast.error(`Something went wrong: ${result}`);
            return;
        }
        set({
            todoLists: [
                ...get().todoLists.map((todoList) => {
                    if (todoList.id === listId) {
                        todoList.todos = todoList.todos.map((todoItem) => {
                            return todoItem.id === todoId ? result : todoItem;
                        })
                    }
                    return todoList;
                })
            ]
        })
    },
    deleteTodoItem: async (listId, todoId) => {
        const result: Result<TodoItem, string> = await invoke("delete_todo_item", {todoId});
        if (typeof result === "string") {
            toast.error(`Something went wrong: ${result}`);
            return;
        }
        set({
            todoLists: [
                ...get().todoLists.map((todoList) => {
                    if (todoList.id === listId) {
                        todoList.todos = todoList.todos.filter((todoItem) =>
                            todoItem.id !== todoId
                        )
                    }
                    return todoList;
                })
            ]
        })
    },
    renameTodoItem: async (listId, todoId, todoText) => {
        const result: Result<TodoItem, string> = await invoke("rename_todo_item", {todoId, todoText});
        if (typeof result === "string") {
            toast.error(`Something went wrong: ${result}`);
            return;
        }
        set({
            todoLists: [
                ...get().todoLists.map((todoList) => {
                    if (todoList.id === listId) {
                        todoList.todos = todoList.todos.map((todoItem) => {
                            return todoItem.id === todoId ? result : todoItem;
                        })
                    }
                    return todoList;
                })
            ]
        })
    },
    deadlineTodoItem: async (listId, todoId, deadline) => {
        const result: Result<TodoItem, string> = await invoke("deadline_todo_item", {todoId, deadline});
        if (typeof result === "string") {
            toast.error(`Something went wrong: ${result}`);
            return;
        }
        if (result.deadline !== null) {
            const utcDeadline = new Date(result.deadline);
        }
        set({
            todoLists: [
                ...get().todoLists.map((todoList) => {
                    if (todoList.id === listId) {
                        todoList.todos = todoList.todos.map((todoItem) => {
                            return todoItem.id === todoId ? result : todoItem;
                        })
                    }
                    return todoList;
                })
            ]
        })
    },
    // ローカルストレージのthemeによってダークモードかどうか判断している
    theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
    setTheme: (theme?: Theme) => {
        // ??...themeかnullかどうか
        theme = theme ?? get().theme;
        theme === 'dark'
            ? document.body.classList.add('dark')
            : document.body.classList.remove('dark');
        localStorage.setItem('theme', theme);
        set({ theme });
    }
}));