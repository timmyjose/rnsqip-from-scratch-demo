Configuring Apple Pay:
======================

Logistics:

Reference: https://developer.squareup.com/docs/in-app-payments-sdk/add-digital-wallets/apple-pay

Sandbox:

This is for the `Sanbdox` environment, but the same instructions for `Production` as well:

1. Go to https://developer.squareup.com/console/en/apps.
2. Click Open on the application.
3. In the left nav bar, choose "Apple Pay" (iOS, __not__ Web).
4. Click "Add Sandbox certificate".
5. Download the CSR file.
6. Go to Apple Developer page (https://developer.apple.com/account/resources/identifiers/list/merchant), creating a new merchant ID, if needed. Eg: merchant.rnsqip-from-scratch-demo.sandbox
7. Edit the Merchant ID, and under "Apple Pay Payment Processing Certificate", upload the CSR from Step 5.
8. Download the Apple certificate.
9. Go back to the `Square` dashboard, and upload the Apple Certificate from Step 8.


Production:

NOTE 1: A new merchant id must be created for `production` since the one from `sandbox` is already associated with an Apple certificate. We can create new ones here - https://developer.apple.com/account/resources/identifiers/list, selecting "Merchant IDs" from the drop-down at the top-right,  and licking on '+'. Eg: merchant.rnsqip-from-scratch-demo.production

NOTE 2: It's better to do one environment (`sandbox`, `production`) at a time since the `Square` wizard requires the generation of the CSR file live (errors out if we try to use a previously generated CSR).


Configuring Google Pay:
=======================

Logistics:

Reference: https://developer.squareup.com/docs/in-app-payments-sdk/add-digital-wallets/google-pay

Sandbox:

1. The user must be signed-in to their Google account.

2. The device/Emulator must have Google Wallet installed - https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel&hl=en_US (not all emulators/devices are supported).


Production:

1. Complete the Integration Checklist - https://developers.google.com/pay/api/android/guides/test-and-deploy/integration-checklist

2. Complete the Google Pay API Production Access Enablement Request Form - https://developers.google.com/pay/api/web/guides/test-and-deploy/request-prod-access

Note: According to https://support.google.com/wallet/answer/12653781?hl=en#:~:text=Important%3A%20On%20June%2010%2C%202024,find%20instructions%20in%20this%20article, Google Wallet requires Android 9 (API Level 28) or higher.
