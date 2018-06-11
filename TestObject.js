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

const IA = require("@intacct/intacct-sdk");

class AbstractTestObject extends IA.Functions.AbstractFunction.default {
    constructor(controlId) {
        super(controlId);
        this.integrationName = "test_object";

        // Declare some properties so we're not flying blind here
        this.name = "";
    }
}

class TestObjectCreate extends AbstractTestObject {
    constructor(controlId) {
        super(controlId);
    }

    writeXml(xml) {
        xml.writeStartElement("function");
        xml.writeAttribute("controlid", this.controlId, true);
        xml.writeStartElement("create");
        xml.writeStartElement(this.integrationName); // Integration name in the system.

        if (this.name == null) {
            throw new Error("Name field is required for create");
        }

        xml.writeElement("NAME", this.name, true);

        xml.writeEndElement(); // test_object
        xml.writeEndElement(); // create
        xml.writeEndElement(); // function
    }
}
exports.TestObjectCreate = TestObjectCreate;
