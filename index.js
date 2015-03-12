var Templz = require("templz"),
    fs = require("fs"),
    pt = require("path");

var cache = {};

function compileFile(path, options, done) {
    if (options.cache && cache[path])
        return done(null, cache[path]);

    fs.readFile(path, { encoding: "utf8" }, function(error, content) {
        if (error) return done(error);

        try {
            var template = Templz.compile(content, options.delimiters);
            if (options.cache) cache[path] = template;
            done(null, template);
        } catch (e) {
            done(e);
        }
    });
}

module.exports = exports = {
    __express: function(path, options, callback) {
        var data = {},
            thrown,
            template,
            partials,
            waiting = 1;

        // Check if everything has been done, then proceed
        function checkFinished() {
            if (--waiting) return;
            try {
                callback(null, template.render(data, partials));
            } catch (e) { callback(e); }
        }

        if (options && typeof options === "object") {
            // Creating a shallow copy of the options
            for (var prop in options)
                if (["cache", "partials", "delimiter"].indexOf(prop) === -1)
                    data[prop] = options[prop];

            if (options.partials && typeof options.partials === "object") {
                // Creating the map of partials with precompiled templates
                partials = {};
                for (var name in options.partials) {
                    var partial = options.partials[name];

                    if (typeof partial === "string") {
                        if (!pt.extname(partial)) partial += this.ext;
                        partial = this.lookup(partial);

                        waiting++;
                        compileFile(partial, options, function(error, partial) {
                            if (error) return !thrown && callback(thrown = error);

                            partials[name] = partial;
                            checkFinished();
                        });
                    } else partials[name] = partial;
                }
            }
        }

        data.filename = path;

        compileFile(path, options, function(error, temp) {
            if (error) return !thrown && callback(thrown = error);

            template = temp;
            checkFinished();
        });
    }
};
exports.renderFile = exports.__express;