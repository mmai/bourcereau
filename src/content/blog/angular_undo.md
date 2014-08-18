---
title: Gestion des erreurs utilisateur avec Angular.js
date: 2014-05-28
tags: angularjs, ux, javascript
lang: .
template: post.jade
---

Dans le développement d'une interface permettant de supprimer des données, il est courant d'ajouter une sécurité sous forme de demande de confirmation avant d'effectuer la suppression.

Ce n'est pas un procédé idéal pour l'utilisateur : celui-ci est interrompu dans son travail par une boîte de dialogue non pertinente la plupart du temps (elle ne l'est que lorsqu'il fait effectivement une erreur). Il est ralenti par la necessité de valider à deux reprises et subit le micro-stress de cette boîte anxiogène. En outre, dans une session de suppressions répétées il peut prendre l'habitude de systématiquement valider deux fois en ne prêtant plus attention à la fenêtre d'avertissement, la rendant ainsi inefficace.

C'est pourquoi on privilégie une solution moins intrusive : la suppression immédiate, sans demande de confirmation, mais avec la possibilité d'annuler l'action en cas d'erreur. Cela fluidifie le workflow et l'utilisateur sait qu'il a toujours la possibilité de revenir en arrière. 

![Undo deletion in Giaffer](/images/posts/Giaffer_undo.png "Undo deletion in Giaffer")

La mise en place d'un système d'annulation s'avère très simple sous Angular :

Lors d'une suppression, on conserve dans le scope les données de l'élément supprimé.

Dans le template on peut peut savoir si un élément vient d'être supprimé en vérifiant la présence des données dans le scope, on affiche le cas échéant un message contenant un lien dont l'action se contente de réenregistrer l'élément à partir des données conservées.

J'ai utilisé ce principe dans la page d'administration des "intérêts" de [Giaffer](http://mmai.github.io/giaffer/). Voici ce que cela donne au niveau du controleur ([app/interests/interests.js](https://github.com/mmai/giaffer/blob/master/src/app/interests/interests.js)) :

```
.controller('InterestsCtrl', [ '$scope', '$rootScope', '$interests',
   function($scope, $rootScope, $interests){
     $scope.interests = $interests.all();
     $scope.deletedInterest = null;

     $scope.deleteInterest = function(interest){
       $scope.deletedInterest = interest;
       $interests.delete(interest.id);
       $scope.interests = $interests.all();
     };

     $scope.undoDeleteInterest = function(){
       $scope.deletedInterest.save();
       $scope.interests = $interests.all();
       $scope.closeUndoDelete();
     };

     $scope.closeUndoDelete = function(){
       $scope.deletedInterest = null;
     };
   }
]);
```
  
Dans le template ([app/interests/interests.tpl.html](https://github.com/mmai/giaffer/blob/master/src/app/interests/interests.tpl.html)) j'ai utilisé la directive [alert](http://angular-ui.github.io/bootstrap/#/alert) fournie par Angular Bootstrap.  

```html
<alert type="warning" ng-show="deletedInterest !== null" close="closeUndoDelete()">
        <strong>{{deletedInterest.name}}</strong> has been deleted.&nbsp;&nbsp;
        <a ng-click="undoDeleteInterest()">Undo</a>
</alert>


<i class="btn glyphicon glyphicon-trash" ng-click="deleteInterest(interest)"></i>
```

Le code de l'application complète est disponible sur Github : [Giaffer](https://github.com/mmai/giaffer)
