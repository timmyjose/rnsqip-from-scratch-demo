use std::env;

use crate::{errors::SqipBackendError, AppState};
use actix_web::{post, web, HttpResponse};
use log::debug;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use square_api_client::models::{
    enums::Currency, CreateOrderRequest, CreateOrderResponse, CreatePaymentRequest, Money, Order,
    OrderLineItem,
};

const SQUARE_LOCATION_ID: &str = "SQUARE_LOCATION_ID";

#[derive(Debug, Deserialize)]
pub struct ChargeForCookieInput {
    pub nonce: String,
}

#[derive(Debug, Serialize)]
pub struct ChargeForCookieOutput {}

fn get_location_id() -> eyre::Result<String> {
    Ok(env::var(SQUARE_LOCATION_ID)?)
}

fn generate_idempotency_key() -> String {
    let mut buffer = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut buffer);
    hex::encode(buffer)
}

/// generate a cookie order
fn get_cookie_order_request(location_id: &str) -> CreateOrderRequest {
    let idempotency_key = generate_idempotency_key();
    let cookie_order = Order {
        location_id: Some(location_id.to_string()),
        line_items: Some(vec![OrderLineItem {
            name: Some("Cookie 🍪".to_string()),
            quantity: "1".to_string(),
            base_price_money: Some(Money {
                amount: 100,
                currency: Currency::Usd,
            }),
            ..Default::default()
        }]),
        ..Default::default()
    };

    CreateOrderRequest {
        idempotency_key: Some(idempotency_key),
        order: Some(cookie_order),
    }
}

/// create a cookie payment request
fn create_cookie_payment_req(
    cookie_order_res: &CreateOrderResponse,
    location_id: &str,
    nonce: &str,
) -> CreatePaymentRequest {
    CreatePaymentRequest {
        idempotency_key: generate_idempotency_key(),
        amount_money: cookie_order_res.order.total_money.clone().unwrap(),
        source_id: nonce.to_string(),
        order_id: cookie_order_res.order.id.clone(),
        autocomplete: Some(true),
        location_id: Some(location_id.to_string()),
        ..Default::default()
    }
}

#[post("/chargeForCookie")]
async fn charge_for_cookie(
    app_state: web::Data<AppState>,
    cookie_input: web::Json<ChargeForCookieInput>,
) -> Result<HttpResponse, SqipBackendError> {
    debug!("Got a request: {cookie_input:#?}");

    let square_client = app_state.square_client.clone();
    let location_id = get_location_id().map_err(|_| SqipBackendError::LocationIdMissing)?;

    // create the order
    let cookie_order_req = get_cookie_order_request(&location_id);
    let cookie_order_res = square_client.orders.create_order(&cookie_order_req).await?;

    // create the payment
    let cookie_payment_req =
        create_cookie_payment_req(&cookie_order_res, &location_id, &cookie_input.nonce);
    let cookie_payment_res = square_client
        .payments
        .create_payment(&cookie_payment_req)
        .await?;

    let cookie_payment = serde_json::to_string_pretty(&cookie_payment_res.payment)?;

    debug!("{}", cookie_payment);

    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(cookie_payment))
}
