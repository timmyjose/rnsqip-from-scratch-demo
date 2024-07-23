use actix_web::{
    error::ResponseError,
    http::{header::ContentType, StatusCode},
    HttpResponse,
};
use thiserror::Error;

// TODO: improve error-handling - status codes mapping?
#[derive(Debug, Error)]
pub enum SqipBackendError {
    #[error("An API Error occurred")]
    ApiError(#[from] square_api_client::models::errors::ApiError),

    #[error("JSON decoding error")]
    JsonError(#[from] serde_json::Error),

    #[error("Location ID is missing")]
    LocationIdMissing,

    #[error("Server Not Authorized. Please check your server permission.")]
    Unauthorized,

    #[error("Card declined. Please re-enter card information.")]
    GenericDecline,

    #[error("Invalid CVV. Please re-enter card information.")]
    CvvFailure,

    #[error("Invalid Postal Code. Please re-enter card information.")]
    AddressVerificationError,

    #[error("Invalid expiration date. Please re-enter card information.")]
    ExpirationFailure,

    #[error("Insufficient funds; Please try re-entering card details.")]
    InsufficientFunds,

    #[error("The card is not supported either in the geographic region or by the MCC; Please try re-entering card details.")]
    CardNotSupported,

    #[error("Processing limit for this merchant; Please try re-entering card details.")]
    PaymentLimitExceeded,

    #[error("Unknown temporary error; please try again;")]
    TemporaryError,

    #[error("Payment error. Please contact support if issue persists.")]
    GenericPaymentError,
}

impl ResponseError for SqipBackendError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::json())
            .body(self.to_string())
    }

    fn status_code(&self) -> StatusCode {
        match *self {
            SqipBackendError::ApiError(..) => StatusCode::BAD_REQUEST, // todo
            SqipBackendError::JsonError(..) => StatusCode::INTERNAL_SERVER_ERROR,
            SqipBackendError::LocationIdMissing => StatusCode::BAD_REQUEST,
            SqipBackendError::Unauthorized => StatusCode::UNAUTHORIZED,
            SqipBackendError::GenericDecline => StatusCode::BAD_REQUEST,
            SqipBackendError::CvvFailure => StatusCode::BAD_REQUEST,
            SqipBackendError::AddressVerificationError => StatusCode::BAD_REQUEST,
            SqipBackendError::ExpirationFailure => StatusCode::BAD_REQUEST,
            SqipBackendError::InsufficientFunds => StatusCode::BAD_REQUEST,
            SqipBackendError::CardNotSupported => StatusCode::BAD_REQUEST,
            SqipBackendError::PaymentLimitExceeded => StatusCode::BAD_REQUEST,
            SqipBackendError::TemporaryError => StatusCode::INTERNAL_SERVER_ERROR,
            SqipBackendError::GenericPaymentError => StatusCode::BAD_REQUEST,
        }
    }
}