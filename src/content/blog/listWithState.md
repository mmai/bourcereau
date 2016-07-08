---
title: Nicta State walkthrough
date: 2015-09-21
tags: haskell, nicta
lang: .
draft: true
template: post.jade
---

# Le contexte

J'apprend Haskell en suivant les recommandations : après avoir étudié http://www.seas.upenn.edu/~cis194/spring13/ je me suis lancé dans les exercices https://github.com/NICTA/course/ .
J'ai progressé régulièrement, avec un peu d'efforts et en m'aidant parfois des solutions https://github.com/tonymorris/course ; jusqu'à ce que j'atteigne l'implémentation de firstRepeat dans le chapitre State.hs : j'ai passé des heures à tenter de comprendre la solution (sans parler de résoudre l'exercice par moi-même).

J'étais prévenu, ces exercices ont été prévus pour êtres résolus dans le cadre d'un cours avec l'aide d'un instructeur: les solutions sont livrées brutes, sans explications ni quelconque commentaire.

# Le problème

Trouver le premier élément qui se répète dans une liste en se servant d'une Monade *State*, d'une structure d'ensemble *Set* et de la fonction implémentée préacédemment *findM* qui retourne le premier élément d'une liste satisfaisant une certaine condition tout en mettant à jour un état interne lors du parcours de la liste.

Signature de *findM* :
```haskell
-- | Find the first element in a `List` that satisfies a given predicate.
-- It is possible that no element is found, hence an `Optional` result.
-- However, while performing the search, we sequence some `Monad` effect through.
findM :: Monad f =>
  (a -> f Bool) -> List a -> f (Optional a)
findM _ Nil = pure Empty
findM p (h :. t) = (\q -> if q then pure (Full h) else findM p t) =<< p h
```

On concoit assez rapidemment le principe : on va utiliser un *State* initialisé avec un *Set* vide et une fonction qui pour un élément *a* retourne une paire (estPresent, nouvelEtat) avec *estPresent* booléen indiquant si *a* est dans *Set*, *nouvelEtat* étant le *State* avec *Set* auquel on a ajouté *a*. 

Voici la solution:

```haskell
firstRepeat :: Ord a => List a -> Optional a
firstRepeat = listWithState findM S.member

listWithState :: Ord a1 =>
  ((a1 -> State (S.Set a1) a2) -> t -> State (S.Set a3) a) -> (a1 -> S.Set a1 -> a2) -> t -> a 
listWithState f m x = eval (f (State . lift2 (lift2 (,)) m S.insert) x) S.emp
```

# Mes difficultés

## Algorithmique

Comment accéder à la liste qui est encapsulée dans le *State* ?

## Propre à Haskell

Plusieurs niveaux d'abstraction qui ne se reflètent pas dans la syntaxe : on est constamment obligé de regarder la signature et on l'oublie toutes les 5mn.
Distinction entre fonctions, types, valeurs, contstructeurs...
Culture des variables non explicites : une lettre...

# La solution pas à pas

## Se documenter

La principale difficulté est finalement de bien comprendre ce qu'est un State et comment l'utiliser, ce que je n'ai pas pu faire avec le simple code source de State.hs ou le haskellwiki, et il n'y a rien à ce propos dans le cis194.
La lumière est venue de l'article http://brandon.si/code/the-state-monad-a-tutorial-for-the-confused/

## Réflexions

Nous voulons tester si un élément de type *a* appartient à un ensemble *Set*, nous utilirons la fonction *Set.member::a -> Set a -> Boolean* qu'il va nous falloir appliquer à un *State*, nous devrons aussi utiliser aussi la fonction *Set.insert* pour mettre à jour l'état. Mes premières tentatives étaient d'essayer de combiner ces deux fonctions avec des map ou des apply sur une Monade State, jusqu'à ce que je m'apperçoive que la structure State se construit en deux étapes prenant chacune une fonction pour paramètre.

State est une fonction qui prend en paramètre une fonction d'un State vers une paire (valeur, nouveau state): State:: (s -> (a,s)) -> State s a, et qui retourne une monade State qui elle même est défini par une fonction interne de s vers (a,s).

Nous devons fournir deux paramètres à notre fonction S.member : le Set et l'élément à chercher, le Set provient de l'état du State, l'élément à chercher de la liste qui n'est pas connue du State, c'est un élément extérieur qui doit donc servir à la construction de runState : x élément de List connu -> runState: s -> (x `member` s, x `insert` s)

--

findM:: (a -> f Bool) -> List a -> f (Optional app)

La fonction (a -> f Bool) que l'on fournit à findM va être *lift2 S.member*.
