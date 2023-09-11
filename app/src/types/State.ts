import { Theme } from "@tauri-apps/api/window";
import { TodoList } from "./TodoList";
// import { Result } from "./Result";
// import { TodoItem } from "./TodoItem";

// 状態を管理...Stateはオブジェクト型の型エイリアス(型エイリアスは色々な型、関数を分かりやすく命名できる)
export type State = {
    todoLists: TodoList[]; //複数のListが格納
    selectedTodoList: TodoList | null; // 選択されているList
    selectTodoList: (todoList: TodoList | null) => void; //Listを選択
    getTodoLists: () => void, //Listsを取得する

    createTodoList: (name: string) => void; //Listを作る
    deleteTodoList: (listId: number) => void; // Listを削除
    renameTodoList: (listId: number, newName: string) => void; //Listの名前変更

    createTodoItem: (listId: number, todoText: string) => void; //Itemを追加
    updateTodoItemComplete: (listId: number, todoId: number, complete: boolean,) => void, //completeを更新
    deleteTodoItem: (listId: number, todoId: number) => void;
    renameTodoItem: (listId: number, todoId: number, todoText: string) => void,
    deadlineTodoItem: (listId: number, todoId: number, deadline: Date) => void,
    itemDeadlines: number[];
    getTodoItemDeadline: () => void,
    
    theme: Theme, //ホワイト、ブラック
    setTheme: (theme?: Theme) => void; //theme?とすることで、Theme型である場合と、そうでない場合を受け取れる
}