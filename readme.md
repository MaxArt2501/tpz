tpz
===
[Templz](https://github.com/MaxArt2501/templz) view engine for [Express](http://expressjs.com/).

## Installation

Inside your Express project root directory:

```bash
$ npm install tpz --save
```

## Usage

```js
var express = require("express");
var app = express();
app.set("view engine", "tpz");
```

Now any file with extension `.tpz` will be rendered using Templz.

If you want to use Templz to render files with different extensions, you can always do this:

```js
// .hjs is normally associated with Hogan, which is compatible with Templz
app.engine("hjs", require("tpz").renderFile);
```

## License

MIT. See [LICENSE](LICENSE).