---
title: Un simple menu avec Metalsmith
draft: true
date: 2014-08-26
tags: metalsmith, jade, static, javascript
lang: .
template: post.jade
---

Je voulais pouvoir appliquer un style distinct sur l'entrée de menu correspondant à la page courante. 
Metalsmith nous permet de connaitre l'url de la page courante avec la métadonnée variable "path" disponible dans le contexte du template.
Une simple boucle sur un tableau contenant les pages de destination de chaque entrée du menu nous permet de parvenir à nos fins. 


```jade
- menu = [{title:"Accueil", url: "/"}, {title:"Blog", url: "/blog"}, {title:"Freelance", url: "/pages/freelance"}, {title:"Contact", url: "/pages/contact"}]
  ul.nav.navbar-nav.navbar-center
    each page in menu
      - var is_current = (path == page.url)
      li(class=is_current?'active':'')
        a(href=page.url)=page.title
```

Le problème : quand je vais sur un billet de blog, aucun menu ne lui est associé. Je voudrais que l'entrée "blog" soit sélectionnée pour tous les articles de la catégorie blog.

On peut associer une même entrée de menu à tous les pages d'un même ensemble (les articles d'un blog par exemple) en testant également la metadonne "collection". 

```jade
- menu = [{title:"Accueil", url: "/", collection:""}, {title:"Blog", url: "/blog", collection:"blog"}, {title:"Freelance", url: "/pages/freelance", collection:""}, {title:"Contact", url: "/pages/contact", collection:""}]
  ul.nav.navbar-nav.navbar-center
    each page in menu
      - var is_current = (path == page.url || collection == page.collection)
      li(class=is_current?'active':'')
        a(href=page.url)=page.title
```

