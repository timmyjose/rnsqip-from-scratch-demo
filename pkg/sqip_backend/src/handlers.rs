use actix_web::{post, web, HttpResponse, Responder};
use log::debug;
use serde::{Deserialize, Serialize};

//app.post('/chargeForCookie', async (request, response) => {
//    console.log(`Received request on /chargeForCookie: ${request.body}`)
//
//    const requestBody = request.body;
//    try {
//      const locationId =  process.env.LOCATION_ID;
//      const createOrderRequest = getOrderRequest(locationId);
//      const createOrderResponse = await ordersApi.createOrder(createOrderRequest);
//
//      const createPaymentRequest = {
//        idempotencyKey: crypto.randomBytes(12).toString('hex'),
//        sourceId: requestBody.nonce,
//        amountMoney: {
//          ...createOrderResponse.result.order.totalMoney,
//        },
//        orderId: createOrderResponse.result.order.id,
//        autocomplete: true,
//        locationId,
//      };
//      const createPaymentResponse = await paymentsApi.createPayment(createPaymentRequest);
//      console.log(createPaymentResponse.result.payment);
//
//      response.status(200).json(createPaymentResponse.result.payment);
//    } catch (e) {
//      console.log(
//        `[Error] Status:${e.statusCode}, Messages: ${JSON.stringify(e.errors, null, 2)}`);
//
//      sendErrorMessage(e.errors, response);
//    }
//  });

#[derive(Debug, Deserialize)]
pub struct ChargeForCookieInput {
    pub nonce: String,
}

#[post("/chargeForCookie")]
async fn charge_for_cookie(cookie_input: web::Json<ChargeForCookieInput>) -> impl Responder {
    debug!("Got a request: {cookie_input:#?}");

    HttpResponse::Ok().body("dummy")
}
