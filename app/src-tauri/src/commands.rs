use std::vec;

use crate::{
    db::prisma::{
        todo_item,
        todo_list::{self},
    },
    state::AppState,
};
use prisma_client_rust::operator::not;

// tauri::Stateはアプリ全体の状態管理(データベースやアプリの設定など)
#[tauri::command(async)]
pub async fn get_todo_lists(
    // <'_>: これはライフタイムパラメータ（lifetime parameter）で、アプリケーション内で tauri::State がどれだけの時間有効であるかを示します
    // '_ は通常、Rustコンパイラにライフタイムを自動的に推論させることを意味します
    state: tauri::State<'_, AppState>,
) -> Result<Vec<todo_list::Data>, String> {
    match state
        // Prismaクエリ
        .prisma_client
        .todo_list()
        .find_many(vec![]) //初期化
        .with(todo_list::todos::fetch(vec![])) //一緒にListに関連するtodosも取得する
        .exec() //実行
        .await
    {
        Ok(todo_lists) => Ok(todo_lists),
        Err(e) => {
            println!("Error: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command(async)]
pub async fn create_todo_list(
    state: tauri::State<'_, AppState>,
    name: String,
) -> Result<todo_list::Data, String> {
    match state
        .prisma_client
        .todo_list()
        .create(todo_list::name::set(name), vec![])
        .with(todo_list::todos::fetch(vec![]))
        .exec()
        .await
    {
        Ok(new_list) => Ok(new_list),
        Err(e) => {
            println!("Error: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command(async)]
pub async fn delete_todo_list(
    state: tauri::State<'_, AppState>,
    list_id: i32,
) -> Result<Option<todo_list::Data>, String> {
    // 先にitemを削除して参照をなくす
    match state
        .prisma_client
        .todo_item()
        // 複数削除する場合はdelete_manyを使う(特定できないときは、WhereParamが返り値)
        .find_many(vec![todo_item::todo_list_id::equals(list_id)])
        .delete()
        .exec()
        .await
    {
        Ok(_) => {
            match state
                .prisma_client
                .todo_list()
                .find_unique(todo_list::id::equals(list_id))
                .delete()
                .exec()
                .await
            {
                Ok(_) => Ok(None),
                Err(e) => {
                    println!("Error: {:?}", e);
                    Err(e.to_string())
                }
            }
        }
        Err(e) => {
            println!("Error: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command(async)]
pub async fn rename_todo_list(
    state: tauri::State<'_, AppState>,
    list_id: i32,
    new_name: String,
) -> Result<Option<todo_list::Data>, String> {
    match state
        .prisma_client
        .todo_list()
        .find_unique(todo_list::id::equals(list_id))
        .update(vec![todo_list::name::set(new_name)])
        .with(todo_list::todos::fetch(vec![]))
        .exec()
        .await
    {
        Ok(updated_list) => Ok(updated_list),
        Err(e) => {
            println!("Error: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command(async)]
pub async fn create_todo_item(
    state: tauri::State<'_, AppState>,
    list_id: i32,
    todo_text: String,
) -> Result<todo_item::Data, String> {
    match state
        .prisma_client
        .todo_item()
        .create(
            todo_item::todo_list::link(todo_list::id::equals(list_id)),
            todo_item::text::set(todo_text),
            vec![],
        )
        .exec()
        .await
    {
        Ok(new_todo_item) => Ok(new_todo_item),
        Err(e) => {
            println!("Error {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command(async)]
pub async fn update_todo_item_complete(
    state: tauri::State<'_, AppState>,
    todo_id: i32,
    complete: bool,
) -> Result<Option<todo_item::Data>, String> {
    match state
        .prisma_client
        .todo_item()
        .find_unique(todo_item::id::equals(todo_id))
        .update(vec![todo_item::complete::set(complete)])
        .exec()
        .await
    {
        Ok(updated_todo_item) => Ok(updated_todo_item),
        Err(e) => {
            println!("Err{:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command(async)]
pub async fn delete_todo_item(
    state: tauri::State<'_, AppState>,
    todo_id: i32,
) -> Result<Option<todo_item::Data>, String> {
    match state
        .prisma_client
        .todo_item()
        .find_unique(todo_item::id::equals(todo_id))
        .delete()
        .exec()
        .await
    {
        Ok(delete_todo) => Ok(delete_todo),
        Err(e) => {
            println!("Err: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command(async)]
pub async fn rename_todo_item(
    state: tauri::State<'_, AppState>,
    todo_id: i32,
    todo_text: String,
) -> Result<Option<todo_item::Data>, String> {
    match state
        .prisma_client
        .todo_item()
        .find_unique(todo_item::id::equals(todo_id))
        .update(vec![todo_item::text::set(todo_text)])
        .exec()
        .await
    {
        Ok(update_todo) => Ok(update_todo),
        Err(e) => {
            println!("Err: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn deadline_todo_item(
    state: tauri::State<'_, AppState>,
    todo_id: i32,
    deadline: Option<prisma_client_rust::chrono::DateTime<::prisma_client_rust::chrono::Utc>>,
) -> Result<Option<todo_item::Data>, String> {
    if let Some(deadline_datetime) = deadline {
        match state
            .prisma_client
            .todo_item()
            .find_unique(todo_item::id::equals(todo_id))
            .update(
                vec![todo_item::deadline::set(Some(deadline_datetime))], // `jp_time` を`Some`でラップ
            )
            .exec()
            .await
        {
            Ok(update_todo) => {
                println!("{:?}", update_todo);
                Ok(update_todo)
            }
            Err(e) => {
                println!("Err {:?}", e);
                Err(e.to_string())
            }
        }
    } else {
        // `deadline` が `None` の場合、特別な処理を行うかエラーメッセージを返すなどの対応を行います。
        // ここではエラーメッセージを返す例を示しています。
        Err("Deadline not provided.".to_string())
    }
}

// dbからdatetimeを受け取る
#[tauri::command]
pub async fn get_todo_items_deadline(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<todo_item::Data>, String> {
    match state
        .prisma_client
        .todo_item()
        .find_many(vec![not(vec![todo_item::deadline::equals(None)])])
        .exec()
        .await
    {
        Ok(todo_items_deadline) => Ok(todo_items_deadline),
        Err(e) => {
            println!("{}", e);
            Err(e.to_string())
        }
    }
}
