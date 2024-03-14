let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
let server = require('./../app');
chai.should();
chai.use(chaiHttp);

let testData = {
    'createCategory' : {
        "name": "Test - Plain T-Shirts",
        "parent": null
    },
    'createCategoryRes' : {},
    'createNestedCategory' : {
        "name": "Test - Plain T-Shirts - Child",
        "parent": null
    },
    'createNestedCategoryRes' : {},
    'updateCategory' : {
        "_id": null,
        "name": "Test - Plain T-Shirts - Updated",
        "parent": null
    },
    'updateCategoryInvalidParent' : {
        "_id": null,
        "name": "Test - Plain T-Shirts - Updated",
        "parent": null
    },
};

describe('api-tests', () => {

    describe("POST [AddCategory] '/category'", () => {
        it('it should create a new category', (done) => {            
            chai.request(server)
                .post('/category')
                .send(testData.createCategory)
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        done(err);
                    } else {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        expect(res.body).to.have.property("status").equal("SUCCESS");
                        
                        testData.createNestedCategory.parent = res.body.item._id;
                        createCategoryRes = res.body;
                        testData.updateCategory._id = res.body.item._id;
                        
                        done();
                    }
                });
        });
    });

    describe("POST [AddNestedCategory] '/category'", () => {
        it('it should create a new child category', (done) => {            
            chai.request(server)
                .post('/category')
                .send(
                  testData.createNestedCategory
                )
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        expect(res.body).to.have.property("status").equal("SUCCESS");                        
                        testData.createNestedCategoryRes = res.body;                        
                        done();
                    }
                });
        });
    });

    describe("POST [UpdateCategory] '/category'", () => {
      
        it('it should update the category', (done) => {   
            chai.request(server)
                .put(`/category/${testData.updateCategory._id}`)
                .send(testData.updateCategory)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        expect(res.body).to.have.property("status").equal("SUCCESS");
                                               
                        done();
                    }
                });
        });
    });

    describe("POST [UpdateCategory] '/category'", () => {    
        it('it should not update the category as parent is not valid', (done) => {      
            testData.updateCategoryInvalidParent = testData.updateCategory;
            testData.updateCategoryInvalidParent.parent = testData.updateCategoryInvalidParent._id;      
            chai.request(server)
                .put(`/category/${testData.updateCategoryInvalidParent._id}`)
                .send(testData.updateCategoryInvalidParent)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        res.should.not.have.status(200);
                        res.body.should.be.a('object');
                        expect(res.body).to.have.property("status").equal("FAILED");                                               
                        done();
                    }
                });
        });
    });

    describe("GET /categories", () => {
        it('should return categories successfully', (done) => {
            chai.request(server)
                .get('/categories')
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("status").equal("SUCCESS");
                        res.body.should.have.property("count").that.is.at.least(0);
                        res.body.should.have.property("items").that.is.an('array');
    
                        res.body.items.forEach(category => {
                            category.should.have.property("_id").that.is.a('string');
                            category.should.have.property("name").that.is.a('string');
                            if (category.parent !== null)  category.parent.should.be.a('string');
                            category.should.have.property("children").that.is.an('array');
                            category.children.forEach(child => {
                                child.should.have.property("_id").that.is.a('string');
                                child.should.have.property("name").that.is.a('string');
                                if (category.parent !== null)  category.parent.should.be.a('string');
                                category.should.have.property("children").that.is.an('array');
                            });
                        });    
                        done();
                    }
                });
        });
    });

    describe("Delete [DeleteCategory] '/category'", () => {
        it('it should not delete the category because of dependency', (done) => {            
            chai.request(server)
                .delete(`/category/${testData.updateCategory._id}`)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    } else {
                        res.should.not.have.status(200);
                        res.body.should.be.a('object');
                        expect(res.body).to.have.property("status").equal("FAILED");                                               
                        done();
                    }
                });
        });
    });

    describe("Delete [DeleteCategory] '/category'", () => {
        it('it delete the child category because of no dependency', (done) => {            
            chai.request(server)
                .delete(`/category/${testData.createNestedCategoryRes.item._id}`)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        expect(res.body).to.have.property("status").equal("SUCCESS");                                               
                        done();
                    }
                });
        });
    });

    describe("Delete [DeleteCategory] '/category'", () => {
        it('it delete the parent category because of no dependency', (done) => {            
            chai.request(server)
                .delete(`/category/${testData.updateCategory._id}`)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        expect(res.body).to.have.property("status").equal("SUCCESS");                                               
                        done();
                    }
                });
        });
    });

});
