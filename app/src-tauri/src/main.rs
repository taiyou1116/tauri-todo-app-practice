// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
mod db;
use db::{get_client, init_db};
mod menu;
use menu::get_menu;
mod state;
use state::AppState;
mod commands;
use tauri::Manager;

const BUNDLE_IDENTIFIER: &str = "com.taiyou.tauri-todo-app";

#[tokio::main]
async fn main() {
    init_data_dir();
    // prismaクライエント, dbの初期化
    let prisma_client = get_client().await;
    init_db(&prisma_client).await;

    tauri::Builder::default()
        .menu(get_menu())
        // .manage グローバルに値を取得できる
        .manage(AppState { prisma_client })
        .invoke_handler(tauri::generate_handler![
            commands::get_todo_lists,
            commands::create_todo_list,
            commands::delete_todo_list,
            commands::rename_todo_list,
            commands::create_todo_item,
            commands::update_todo_item_complete,
            commands::delete_todo_item,
            commands::rename_todo_item,
            commands::deadline_todo_item,
            commands::get_todo_items_deadline,
        ])
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                #[allow(unused_unsafe)]
                #[cfg(not(target_os = "macos"))]
                {
                    event.window().hide().unwrap();
                }

                #[allow(unused_unsafe)]
                #[cfg(target_os = "macos")]
                unsafe {
                    tauri::AppHandle::hide(&event.window().app_handle()).unwrap();
                }
                api.prevent_close();
            }
            _ => {}
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
}

fn init_data_dir() {
    // データを保存するディレクトリを取得(なかったら現在のディレクトリに生成)
    let data_dir = tauri::api::path::data_dir()
        .unwrap_or(std::path::PathBuf::from("./"))
        .join(BUNDLE_IDENTIFIER);
    // エラー処理
    if !data_dir.exists() {
        fs::create_dir(data_dir).expect("error");
    }
}
