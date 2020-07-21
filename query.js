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

query();

async function query() {

    const bootstrap = require("./bootstrap");
    const IA = require("@intacct/intacct-sdk");
    let logger = bootstrap.logger();

    try {
        const client = bootstrap.client(logger);

        let filter = new IA.Functions.Common.NewQuery.QueryFilter.OrOperator();
        filter.addFilter(new IA.Functions.Common.NewQuery.QueryFilter.Filter("CUSTOMERID").like("c%"));
        filter.addFilter(new IA.Functions.Common.NewQuery.QueryFilter.Filter("CUSTOMERID").like("1%"));

        let orderBuilder = new IA.Functions.Common.NewQuery.QueryOrderBy.OrderBuilder();
        orderBuilder.addDescending("CUSTOMERID");
        const orders = orderBuilder.orders;

        let selectBuilder = new IA.Functions.Common.NewQuery.QuerySelect.SelectBuilder();
        selectBuilder.addFields(["CUSTOMERID", "CUSTOMERNAME"])
            .addSum("TOTALDUE");
        const selects = selectBuilder.selects;

        let query = new IA.Functions.Common.NewQuery.Query();
        query.selectFields = selects;
        query.fromObject = "ARINVOICE";
        query.filter = filter; // Comment out this line to see all invoices without any filtering
        query.caseInsensitive = true;
        query.pageSize = 100;
        query.orderBy = orders;

        logger.info("Executing query to Intacct API");

        const response = await client.execute(query);
        const result = response.getResult();

        logger.debug("Query successful", {
            "Company ID": response.authentication.companyId,
            "User ID": response.authentication.userId,
            "Request control ID": response.control.controlId,
            "Function control ID": result.controlId,
            "Data": result.data,
        });

        let json_data = result.data;

        if (json_data && Array.isArray(json_data) && json_data.length >= 1) {
            console.log(`Success! Total number of results: ${ result.totalCount.toString() }\n`);
            console.log(`First ARINVOICE result found: ${ JSON.stringify(json_data[0]) }`);
            console.log("See the log file (logs/intacct.html) for the complete list of results.\n");
        }  else {
            console.log("The query executed, but no ARINVOICE objects met the query criteria.\n");
            console.log("Either modify the filter or comment it out from the query.\n");
            console.log("See the log file (logs/intacct.html) for the XML request.\n");
        }
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
