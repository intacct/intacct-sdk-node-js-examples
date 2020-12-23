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

/**
 * @return {winston.Logger}
 */
exports.logger = function() {
    const winston = require("winston");
    const path = require("path");

    return new winston.createLogger({
        transports: [
            new winston.transports.File({
                level: "debug",
                filename: path.join(__dirname, "logs", "intacct.log"),
            }),
        ]
    });
};

/**
 * @param {winston.Logger} logger
 * @return {OnlineClient}
 */
exports.client = function (logger) {
    const IA = require("@intacct/intacct-sdk");
    const path = require("path");

    let clientConfig = new IA.ClientConfig();
    clientConfig.profileFile = path.join(__dirname, "credentials.ini");
    clientConfig.logger = logger;

    return new IA.OnlineClient(clientConfig);
};
