var fs = require("fs"),
    assert = require("assert"),
    render = require("../index.js").renderFile;

var nopersons = fs.readFileSync("test/nopersons.html", { encoding: "utf8" }),
    persons = fs.readFileSync("test/persons.html", { encoding: "utf8" });

// Mocking a View object
var view = {
    ext: ".tpz",
    lookup: function(x) { return x; }
};

describe("tpz", function() {
    it("should work", function(done) {
        render.call(view, "test/template.tpz", { place: "Templz" }, function(error, result) {
            if (error) done(error);
            else try {
                assert.equal(result, nopersons, "Wrong with no persons");
                done();
            } catch (e) { done(e); }
        });
    });

    it("should work with partials", function(done) {
        render.call(view, "test/template.tpz", {
            place: "Templz",
            persons: [
                { name: "John", surname: "Doe", age: 42 },
                { name: "Mary", surname: "Smith", age: 27 },
                { name: "Bill", surname: "Fisher", age: 71 }
            ],
            partials: { person: "test/person" }
        }, function(error, result) {
            if (error) done(error);
            else try {
                console.log(result);
                assert.equal(result, persons, "Wrong with partials");
                done();
            } catch (e) { done(e); }
        });
    });
});