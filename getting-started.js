/**
 * Copyright 2020 Sage Intacct, Inc.
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

gettingStarted();

async function gettingStarted() {
    const bootstrap = require("./bootstrap");
    const IA = require("@intacct/intacct-sdk");
    let logger = bootstrap.logger();

    try {
        const client = bootstrap.client(logger);

        let read = new IA.Functions.Common.Read();
        read.objectName = "CUSTOMER";
        read.fields = [
            "RECORDNO", "CUSTOMERID", "NAME"
        ]
        read.keys = [
            33  // Replace with the record number of a customer in your company
        ];

        logger.info("Executing read to Intacct API");

        const response = await client.execute(read);
        const result = response.getResult();

        logger.debug("Read successful", {
            "Company ID": response.authentication.companyId,
            "User ID": response.authentication.userId,
            "Request control ID": response.control.controlId,
            "Function control ID": result.controlId,
            "Data": result.data,
        });

        let json_data = result.data;

        console.log("Result:");
        console.log( JSON.stringify(json_data) );
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
