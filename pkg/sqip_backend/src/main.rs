use actix_web::{web, App, HttpServer};
use square_api_client::SquareClient;
use std::sync::Arc;

mod client;
mod errors;
mod handlers;

use handlers::charge_for_cookie;
use log::info;

use crate::client::configure_square_client;

const LOCALHOST: &str = "192.168.2.106";
const FIXED_PORT: u16 = 8000;

#[derive(Clone)]
pub struct AppState {
    square_client: Arc<SquareClient>,
}

#[tokio::main]
async fn main() -> eyre::Result<()> {
    env_logger::init();
    dotenvy::dotenv()?;

    let square_client = configure_square_client()?;
    let app_state = AppState {
        square_client: Arc::new(square_client),
    };

    info!("Listening on {LOCALHOST}:{FIXED_PORT}");

    Ok(HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .service(charge_for_cookie)
    })
    .bind((LOCALHOST, FIXED_PORT))?
    .run()
    .await?)
}