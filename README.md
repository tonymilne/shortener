# shortener

A url shortener backed by Redis 2.6.x (as it requires Lua script to function).
This module is useful for maintaing a collection of shortened urls, with slugs being generated automatically on `add()`.
This module does not provide any interface or view tracking, it just handles maintaing a sequence and collection of shortened urls.

## Getting Started
Install the module with: `npm install shortener`

```javascript
var Shortener = require('shortener');
var shortener = new Shortener({
	sequenceKey: 'example:sequence',
	hashKey: 'example:urls',
});

shortener.add('http://inlight.com.au', function(err, slug) {
	if (err) {
		throw err;
	}
	console.log('Your url was added with the generated slug: ' + slug);
});
```

## Documentation

Slugs generated using shortener are ordered using base60, derived from an integer sequence number that is maintained by shortener.
Urls are stored in a hash against their generated slug - such that if you delete or modify your sequence number,
you run the risk of overwriting urls that you add using shortener.

The slugs returned by the shortener are case sensitive. The complete sequence of characters used, written out in rows of 10 for readability are:

   0 1 2 3 4 5 6 7 8 9
 0 0 1 2 3 4 5 6 7 8 9
10 A B C D E F G H J K
20 L M N P Q R S T U V
30 W X Y Z _ a b c d e
40 f g h i j k m n o p
50 q r s t u v w x y z

For more information on base60 check out Tantek Çelik's documentation - http://ttk.me/w/NewBase60

## Examples

```javascript
shortener.get('FB', function(err, value) {
	if (err) {
		throw err;
	}
	console.log('The url stored against the slug FB is: ' + value);
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Tony Milne
Licensed under the MIT license.
