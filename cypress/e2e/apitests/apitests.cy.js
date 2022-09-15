import { schema } from "./schema";
import Ajv from "ajv"

//Url function based on page and per_page
const url = (page = 0, per_page = 0) => {
    let link = "https://api.punkapi.com/v2/beers"
    if(page&&per_page) link += `?page=${page}&per_page=${per_page}`
    return link
}

//Validate JSON schema
const validateSchema = (schema, data) => {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    return validate(data)
}

//Method API
const getData = (url, method = 'GET') => {
    cy.request({
        url: url,
        method: method
    })
}
Cypress.Commands.add("getData", getData)

//API Test
describe("No 4", () => {
    it("Data count 1 (page 2)", () => {
        cy.getData(url(2,1)).then((response) => {
            expect(response.body.length).to.eq(1);
            cy.log("Data count: "+ response.body.length)
        });
    });
    it("Data count 5 (page 2)", () => {
        cy.getData(url(2,5)).then((response) =>{
            expect(response.body.length).to.eq(5);
            cy.log("Data count: "+ response.body.length)
        });
    });
    it("Data count 20 (page 2)", () => {
        cy.getData(url(2,20)).then((response) => {
            expect(response.body.length).to.eq(20);
            cy.log("Data count: "+ response.body.length)
        });
    });
})

describe("No 5", () => {
    it("Validate schema", () => {
        cy.getData(url()).then((response) =>{
            const valid = validateSchema(schema, response.body)
            expect(valid).to.eq(true)
            if(valid) cy.log("Schema is valid")
        })
    })
    it("Data count", () => {
        cy.getData(url()).then((response) => {
            expect(response.body.length).to.eq(25);
            cy.log("Data count: "+ response.body.length)
        })
    })
    it("Print name", () => {
        cy.getData(url()).then((response) => {
            response.body.forEach(item => {
                cy.log(item.name)
            });
        })
    })
})