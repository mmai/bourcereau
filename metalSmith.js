var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown'),
    stylus   = require('metalsmith-stylus'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    include  = require('metalsmith-include'),
    inspect  = require('metalsmith-inspect'),
    excerpts = require('metalsmith-excerpts'),
    templates  = require('metalsmith-templates');

//Javascript helpers for use in the templates
var moment = require('moment');
var moment_fr = require('moment/locale/fr');


module.exports = function metalSmith(){
  return Metalsmith(__dirname)
    .use(collections({
      pages: {
        pattern: 'content/pages/*.md'
      },
      blog: {
          pattern: 'content/blog/*.md',
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
    .use(excerpts())
    .use(stylus())
    .use(permalinks({
       pattern: ':lang/:collection/:title',
       relative: false
    }))
    .use(templates({
        engine: 'jade',
        moment: moment,
        moment_fr: moment_fr
        }))
    // .use(inspect())
    .destination('./build')
    .build(function(err,files){
      if (err){ console.log(err); }
    });
};
