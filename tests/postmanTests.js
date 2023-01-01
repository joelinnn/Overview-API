// products without page/count

pm.test("Status Code Check", function () {
    pm.response.to.have.status(200);
})

pm.test("Response time is less than 30ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(30);
});

pm.test("Length of response array should be 5", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.length).to.eql(5);
});

pm.test("response array elements should have id's of 1,2,3,4, and 5", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData[0].id).to.eql(1);
    pm.expect(jsonData[1].id).to.eql(2);
    pm.expect(jsonData[2].id).to.eql(3);
    pm.expect(jsonData[3].id).to.eql(4);
    pm.expect(jsonData[4].id).to.eql(5);
});

// products with page/count

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("20 elements in response array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.length).to.eql(20);
});

pm.test("ID of last element in array is 200", function () {
    var jsonData = pm.response.json();
    var lastProduct = jsonData[jsonData.length - 1].id
    pm.expect(lastProduct).to.eql(200);
});

pm.test("Response time is less than 20ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(20);
});

pm.test("Content-Type is present", function () {
    pm.response.to.have.header("Content-Type");
});

var schema = {
    "id": {
        "type": "number"
    },
    "name": {
        "type": "string",
    },
    "slogan": {
        "type": "string",
    },
    "description": {
      "type": "string",
    },
    "category": {
        "type": "string",
    },
    "default_price": {
        "type": "string",
    }
};

pm.test('Schema is valid', function () {
    var jsonData = pm.response.json();

    jsonData.forEach((element) => {
        pm.expect(element).to.have.jsonSchema(schema)
    })
});

// product with id

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 20ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(20);
});

pm.test("Response should only have one element", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.length).to.eql(1);
});

pm.test("Response should be correct product", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData[0].id).to.eql(999999);
});

pm.test("Content-Type is present", function () {
    pm.response.to.have.header("Content-Type");
});

pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include("Rowland Coat");
});

// styles test

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 20ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(20);
});

var schema = {
    "product_id": {
        "type": "string"
    },
    "results": {
        "type": "array",
        "prefixItems": [
            {"type": "number"},
            {"type": "string"},
            {"type": "string"},
            {"type": "boolean"},
            {"type": "array"},
            {"type": "object"}
        ]
    }
};

pm.test('Schema is valid', function () {
    pm.response.to.have.jsonSchema(schema);
});

pm.test("Content-Type is present", function () {
    pm.response.to.have.header("Content-Type");
});
