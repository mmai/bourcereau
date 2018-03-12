---
title: A simple menu with Metalsmith
draft: false
date: 2014-08-26
tags: metalsmith, jade, static, javascript
lang: en
template: en/post.jade
---

Here's a technique to apply a specific style on the menu item associated with the current page.

Metalsmith allows us to get the URL of the current page with the "path" variable available in the template context. A simple loop over an array containing the destinations of each menu item allows us to achieve our goal:


```jade
- menu = [{title:"Accueil", url: "/"}, {title:"Blog", url: "/blog"}, {title:"CV", url: "/pages/cv"}, {title:"Contact", url: "/pages/contact"}]
  ul.nav.navbar-nav.navbar-center
    each page in menu
      - var is_current = (path == page.url)
      li(class=is_current?'active':'')
        a(href=page.url)=page.title
```

We can associate a single menu entry to all pages of a same set (blog posts for example) by also testing the metadata "collection". This allows us to manage dynamic urls like _/blog/title/_ without using regular expressions which could bring unfortunate side effects.

In practice, I have defined a _blog_ collection in my metalsmith.js file and a url structure that I can edit (by adding the year and the month before the title for example) without having to touch the template menu.

```javascript
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
    }))
    .use(permalinks({
       pattern: ':lang/:collection/:title',
       relative: false
    }))
```

With the following code, the menu entry 'Blog' will be featured on the articles belonging to the "blog" collection:


```jade
- menu = [{title:"Accueil", url: "/", collection:""}, {title:"Blog", url: "/blog", collection:"blog"}, {title:"CV", url: "/pages/cv", collection:""}, {title:"Contact", url: "/pages/contact", collection:""}]
  ul.nav.navbar-nav.navbar-center
    each page in menu
      - var is_current = (path == page.url || collection == page.collection)
      li(class=is_current?'active':'')
        a(href=page.url)=page.title
```

