import { Theme } from "@tauri-apps/api/window";
import { TodoList } from "./TodoList";

// 状態を管理
export type State = {
    todoLists: TodoList[]; //複数のListが格納
    selectedTodoList: TodoList | null; // 選択されているList
    selectTodoList: (todoList: TodoList | null) => void; //Listを選択
    getTodoLists: () => void, //Listsを取得する

    createTodoList: (name: string) => void; //Listを作る
    deleteTodoList: (listId: number) => void; // Listを削除
    renameTodoList: (listId: number, newName: string) => void; //Listの名前変更

    createTodoItem: (listId: number, todoText: string) => void; //Itemを追加
    updateTodoItemComplete: (
        listId: number,
        todoId: number,
        complete: boolean,
    ) => void,
    deleteTodoItem: (listId: number, todoId: number) => void;
    
    theme: Theme, //ホワイト、ブラック
    setTheme: (theme?: Theme) => void; //theme?とすることで、Theme型である場合と、そうでない場合を受け取れる
}