use square_api_client::{
    config::{Configuration, Environment},
    http::{
        client::{HttpClientConfiguration, RetryConfiguration},
        Headers,
    },
    SquareClient,
};

use std::{env, time::Duration};

const SQUARE_API_TOKEN: &str = "SQUARE_API_TOKEN";
const SQUARE_API_VERSION: &str = "SQUARE_API_VERSION";
const SQUARE_ENV: &str = "SQUARE_ENV";

const USER_AGENT: &str = "Cookie User Agent";

const TIMEOUT_IN_SECS: u32 = 60;
const RETRIES_COUNT: u32 = 1;
const RETRY_INTERVAL_IN_SECS: u64 = 1;
const MAX_RETRY_INTERVAL_IN_SECS: u64 = 30 * 60;

const BASE_URI: &str = "/v2";

struct SquareConfiguration {
    api_token: String,
    api_version: String,
    square_env: String,
}

fn str_to_squre_env(env_str: &str) -> Environment {
    match env_str {
        "sandbox" => Environment::Sandbox,
        "production" => Environment::Production,
        _ => Environment::Custom(env_str.to_owned()),
    }
}

fn read_square_configuration() -> eyre::Result<SquareConfiguration> {
    let api_token = env::var(SQUARE_API_TOKEN)?;
    let api_version = env::var(SQUARE_API_VERSION)?;
    let square_env = env::var(SQUARE_ENV)?;

    Ok(SquareConfiguration {
        api_token,
        api_version,
        square_env,
    })
}

pub fn configure_square_client() -> eyre::Result<SquareClient> {
    let square_config = read_square_configuration()?;

    let mut headers = Headers::default();
    headers.set_user_agent(USER_AGENT);

    Ok(SquareClient::try_new(Configuration {
        environment: str_to_squre_env(&square_config.square_env),
        square_version: square_config.api_version,
        http_client_config: HttpClientConfiguration {
            timeout: TIMEOUT_IN_SECS,
            user_agent: USER_AGENT.to_owned(),
            default_headers: headers,
            retry_configuration: RetryConfiguration {
                retries_count: RETRIES_COUNT,
                min_retry_interval: Duration::from_secs(RETRY_INTERVAL_IN_SECS),
                max_retry_interval: Duration::from_secs(MAX_RETRY_INTERVAL_IN_SECS),
                backoff_exponent: 3,
            },
        },
        access_token: format!("Bearer {}", square_config.api_token),
        base_uri: BASE_URI.to_owned(),
    })?)
}