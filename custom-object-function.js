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

customObjectFunction();

async function customObjectFunction() {
    const bootstrap = require("./bootstrap");
    const IA = require("@intacct/intacct-sdk");
    const logger = bootstrap.logger();

    try {
        const client = bootstrap.client(logger);

        const TestObject = require("./TestObject");

        logger.info("Executing create test object function to API");
        
        const create = new TestObject.TestObjectCreate();
        create.name = "hello world";

        const createResponse = await client.execute(create);
        const createResult = createResponse.getResult();

        const recordNo = parseInt(createResult.data[0]["id"]);

        console.log("Created record ID " + recordNo.toString());

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