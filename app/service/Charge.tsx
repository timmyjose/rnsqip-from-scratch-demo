import {CHARGE_SERVER_URL} from '../Constants'
import ChargeError from '../ChargeError'

export default async function chargeCardNonce(
  nonce: string,
  verificationToken = undefined,
) {
  let body
  if (verificationToken === undefined) {
    body = JSON.stringify({
      nonce,
    })
  } else {
    body = JSON.stringify({
      nonce,
      verificationToken,
    })
  }

  console.log(`About to call ${CHARGE_SERVER_URL}`)
  const response = await fetch(CHARGE_SERVER_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  })

  try {
    const responseJson = await response.json()
    if (responseJson.errorMessage != null) {
      console.error(responseJson.message)
      throw new ChargeError(responseJson.errorMessage)
    }
  } catch (error: any) {
    console.error(error.message)
    throw new ChargeError(error.message)
  }
}
