var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    stylus   = require('metalsmith-stylus'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    include  = require('metalsmith-include'),
    jade  = require('metalsmith-jade'),
    inspect  = require('metalsmith-inspect'),
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
      },
      projects: {
          pattern: 'content/projects/*.md',
          sortBy: 'position'
      },
      projets: {
          pattern: 'content/projets/*.md',
          sortBy: 'position'
      }
    }))
    .use(include())
    .use(markdown({
      "gfm": true
        }
      ))
    .use(stylus())
    .use(permalinks({
       pattern: ':lang/:collection/:title'
    }))
    .use(jade())
    .use(templates('jade'))
    // .use(inspect())
    .destination('./build')
    .build(function(err,files){
      if (err){ console.log(err); }
    });
};
