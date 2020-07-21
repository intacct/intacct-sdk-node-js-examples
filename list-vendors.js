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

listVendors();

async function listVendors() {
    const bootstrap = require("./bootstrap");
    const IA = require("@intacct/intacct-sdk");
    let logger = bootstrap.logger();

    try {
        const client = bootstrap.client(logger);

        let query = new IA.Functions.Common.ReadByQuery();
        query.objectName = "VENDOR";
        query.pageSize = 2; // Keep the count to just 2 for the example
        query.fields = [
            "RECORDNO",
            "VENDORID",
        ];

        logger.info("Executing query to Intacct API");

        const response = await client.execute(query);
        const result = response.getResult();
        logger.debug("Query successful - page 1", {
            "Total count": result.totalCount,
            "Data": result.data,
        });

        console.log("Page 1 success! Number of vendor records found: " + result.totalCount + ". Number remaining: " + result.numRemaining);

        let i = 1;
        while (result.numRemaining > 0 && i <= 3 && result.resultId != null) {
            i++;
            let more = new IA.Functions.Common.ReadMore();
            more.resultId = result.resultId;

            const responseMore = await client.execute(more);
            const resultMore = responseMore.getResult();

            logger.debug("Read More successful - page " + i, {
                "Total remaining": result.numRemaining,
                "Data": result.data,
            });

            console.log("Page " + i + " success! Records remaining: " + resultMore.numRemaining);
        }

        console.log("Successfully read " + i + " pages");

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
