/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const fabric = require('fabric-shim');
const composer = require('composer-api');

let SmartContract = class {

    // The Invoke method is called as a result of an application request to run the Smart Contract
    // 'fabcar'. The calling application program has also specified the particular smart contract
    // function to be called, with arguments
    async Invoke(api) {
        let ret = api.getFunctionAndParameters();
        console.info(ret);
        let method = this[ret.fcn];
        try {
            let payload = await method(api, ret.params);
            return fabric.success(payload);
        } catch (err) {
            console.log(err);
            return fabric.error(err);
        }
    }

    /**
     *
     * @param api - the fabric/composer API api
     * @param {org.acme.vehicle.Transfer} transfer - the transfer to be processed
     * @transaction
     */
    async changeCarowner(api, transfer) {
        transfer.car.owner = transfer.newOwner;
        const carRegistry = await api.getAssetRegistry('org.acme.vehicle.Car');
        await carRegistry.update(transfer.car);
    }

};

fabric.addExtension(composer);
fabric.start(new SmartContract());


