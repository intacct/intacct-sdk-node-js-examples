/**
 * Copyright 2018 Sage Intacct, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "LICENSE" file accompanying this file. This file is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

crudCustomer();

async function crudCustomer() {
    const bootstrap = require("./bootstrap");
    const IA = require("@intacct/intacct-sdk");
    let logger = bootstrap.logger();

    try {
        const client = bootstrap.client(logger);

        logger.info("Executing CRUD customer functions to API");

        let create = new IA.Functions.AccountsReceivable.CustomerCreate();
        create.customerName = "Joshua Granley";
        create.active = false;

        const createResponse = await client.execute(create);
        const createResult = createResponse.getResult();

        const customerId = createResult.data[0]["CUSTOMERID"];
        const recordNo = parseInt(createResult.data[0]["RECORDNO"]);

        console.log("Created inactive customer ID " + customerId);

        let update = new IA.Functions.AccountsReceivable.CustomerUpdate();
        update.customerId = customerId;
        update.active = true;

        const updateResponse = await client.execute(update);

        console.log("Updated customer ID " + customerId + " to active");

        let read = new IA.Functions.Common.Read();
        read.objectName = "CUSTOMER";
        read.fields = [
            "RECORDNO",
            "CUSTOMERID",
            "STATUS",
        ];
        read.keys = [
            recordNo,
        ];

        const readResponse = await client.execute(read);

        console.log("Read customer ID " + customerId);

        let del = new IA.Functions.AccountsReceivable.CustomerDelete();
        del.customerId = customerId;

        const deleteResponse = await client.execute(del);

        console.log("Deleted customer ID " + customerId);

    } catch (ex) {
        if (ex instanceof IA.Exceptions.ResponseException) {
            logger.error("An Intacct response exception was thrown", {
                "Class": ex.constructor.name,
                "Message": ex.message,
                "API Errors": ex.errors,
            });
            console.log("Failed! " + ex.message);
        } else {
            logger.error("An exception was thrown", {
                "Class": ex.constructor.name,
                "Message": ex.message,
            });
            console.log(ex.name)
        }
    }
}
