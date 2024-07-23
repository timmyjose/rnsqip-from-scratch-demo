use actix_web::{App, HttpServer};
use std::env;

mod handlers;
mod orders;
mod payments;

use handlers::charge_for_cookie;
use log::info;

const LOCALHOST: &str = "192.168.2.106";
const STATIC_PORT: u16 = 8000;

#[tokio::main]
async fn main() -> eyre::Result<()> {
    env_logger::init();
    dotenvy::dotenv()?;

    for (key, value) in env::vars() {
        println!("{key}: {value}");
    }

    info!("Listening on localhost:{STATIC_PORT}");

    Ok(HttpServer::new(|| App::new().service(charge_for_cookie))
        .bind((LOCALHOST, STATIC_PORT))?
        .run()
        .await?)
}