---
title: Construction d'un menu dans Metalsmith
draft: false
date: 2014-08-26
tags: metalsmith, jade, static, javascript
lang: .
template: post.jade
---

Voici une technique pour appliquer un style spécifique sur l'entrée de menu associée à la page courante.

Metalsmith nous permet de connaitre l'url de la page courante avec la variable "path" disponible dans le contexte du template. Une simple boucle sur un tableau contenant les pages de destination de chaque entrée du menu nous permet donc de parvenir à nos fins : 


```jade
- menu = [{title:"Accueil", url: "/"}, {title:"Blog", url: "/blog"}, {title:"CV", url: "/pages/cv"}, {title:"Contact", url: "/pages/contact"}]
  ul.nav.navbar-nav.navbar-center
    each page in menu
      - var is_current = (path == page.url)
      li(class=is_current?'active':'')
        a(href=page.url)=page.title
```

On peut associer une même entrée de menu à tous les pages d'un même ensemble (les articles d'un blog par exemple) en testant également la métadonné "collection". Cela permet de gérer des urls dynamiques de type /blog/titredelarticle/ sans avoir recours à des expressions régulières aux effets de bord indésirables.

En pratique, j'ai défini une catégorie blog dans mon fichier metalsmith.js et une structure d'url que je pourrai modifier (ajouter l'année et le mois avant le titre par exemple) sans avoir à toucher au template du menu. 

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

Avec le code suivant, l'entrée de menu 'Blog' sera sélectionnée sur les pages d'articles de la collection "blog".


```jade
- menu = [{title:"Accueil", url: "/", collection:""}, {title:"Blog", url: "/blog", collection:"blog"}, {title:"CV", url: "/pages/cv", collection:""}, {title:"Contact", url: "/pages/contact", collection:""}]
  ul.nav.navbar-nav.navbar-center
    each page in menu
      - var is_current = (path == page.url || collection == page.collection)
      li(class=is_current?'active':'')
        a(href=page.url)=page.title
```

