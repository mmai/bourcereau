var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    stylus   = require('metalsmith-stylus'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    templates  = require('metalsmith-templates');


module.exports = function metalSmith(){
  return Metalsmith(__dirname)
    .use(collections({
      pages: {
        pattern: 'content/pages/*.md'
      },
      posts: {
          pattern: 'content/posts/*.md',
          sortBy: 'date',
          reverse: true
      }
    }))
    .use(markdown())
    .use(stylus())
    .use(templates('jade'))
    .use(permalinks({
       pattern: ':collection/:title'
    }))
    .destination('./build')
    .build(function(err,files){
      if (err){ console.log(err); }
    });
};
