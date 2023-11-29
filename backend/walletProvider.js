// WalletProvider.js

import { SignableMessage, Transaction } from "@multiversx/sdk-core";
import qs from 'qs'
import {
    WALLET_PROVIDER_CALLBACK_PARAM,
    WALLET_PROVIDER_CALLBACK_PARAM_TX_SIGNED,
    WALLET_PROVIDER_CONNECT_URL,
    WALLET_PROVIDER_DISCONNECT_URL,
    WALLET_PROVIDER_GUARD_TRANSACTION_URL,
    WALLET_PROVIDER_SIGN_MESSAGE_URL,
    WALLET_PROVIDER_SIGN_TRANSACTION_URL
} from "./constants.js";
/* import { ErrCannotGetSignedTransactions, ErrCannotSignedMessage } from "./errors";
import { PlainSignedTransaction } from "./plainSignedTransaction"; */

export class WalletProvider {
    constructor(walletURL) {
        this.walletUrl = walletURL;
    }

    buildWalletUrl(options) {
        const callbackUrl = options?.callbackUrl || window.location.href;
        const partialQueryString = qs.stringify(options.params || {});
        const fullQueryString = partialQueryString ? `${partialQueryString}&callbackUrl=${callbackUrl}` : `callbackUrl=${callbackUrl}`;
        const url = `${this.baseWalletUrl(options.endpoint)}/?${fullQueryString}`;

        console.info(`Redirecting to Wallet URL: ${decodeURI(url)}`);

        return url;
    }

    baseWalletUrl(endpoint) {
        const pathArray = this.walletUrl.split('/');
        const protocol = pathArray[0];
        const host = pathArray[2];
        return `${protocol}//${host}/${endpoint}`;
    }


    async login(res, options = { callbackUrl: '', token: '', redirectDelayMilliseconds: 0 }) {
        return this.buildWalletUrl({
            endpoint: WALLET_PROVIDER_CONNECT_URL,
            callbackUrl: options.callbackUrl,
            params: {
                token: options.token
            }
        });

     
    }

    async redirect(res, url, delayMilliseconds) {
        if (delayMilliseconds) {
            await this.redirectLater(res, url, delayMilliseconds);
        } else {
            this.redirectImmediately(res, url);
        }
    }

    redirectImmediately(res, url) {
       res.redirect(url) // Note: This assumes you're running this code in a browser environment
    }

    async redirectLater(res, url, delayMilliseconds) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, delayMilliseconds);
        });

        res.redirect(url);
    }

    async logout(options = { callbackUrl: '', redirectDelayMilliseconds: 0 }) {
        const redirectUrl = this.buildWalletUrl({
            endpoint: WALLET_PROVIDER_DISCONNECT_URL,
            callbackUrl: options.callbackUrl
        });

        await this.redirect(redirectUrl, options.redirectDelayMilliseconds);
        return true;
    }

    async signMessage(message, options = { callbackUrl: '' }) {
        const redirectUrl = this.buildWalletUrl({
            endpoint: WALLET_PROVIDER_SIGN_MESSAGE_URL,
            callbackUrl: options.callbackUrl,
            params: {
                message: message.message.toString()
            }
        });

        await this.redirect(redirectUrl);
        return redirectUrl;
    }

   
}

