---
title: Comment Angular m'a permis d'amélorer d'expérience utilisateur tout en simplifiant le développement
lang: .
template: post.jade
---

Lorsqu'on offre à l'utilisateur la possibilité de supprimer des données, le premier réflexe du développeur est souvent d'ajouter une sécurité sous forme de demande de confirmation avant d'effectuer la suppression.

Mais ce n'est pas l'idéal du point de vue expérience utilisateur. Celui-ci voit son interrompu par une boîte de dialogue qui n'est pertinente que s'il fait une erreur, c'est à dire dans un nombre réduit de fois. Il doit valider deux fois et subit le micro-stress de cette boîte anxiogène. Dans une session de suppressions répétées, il peut aussi prendre l'habitude de systématiquement valider deux fois sans réfléchir et ainsi rendre de fait cette boite innefficace.

En fait c'est un pattern qui n'est plus utilisé dans les interfaces des applications professionnelles évoluées. Ceux-ci effectuent immédiatement la suppression, mais proposent en revanche d'annuler l'action en cas d'erreur. La boite disparait, fluidifiant le workflow de l'utilisateur, qui sait qu'il a toujours la possibilité de revenir en arrière. 

![Undo deletion in Giaffer](/images/posts/Giaffer_undo.png "Undo deletion in Giaffer")

En développant l'interface d'administration de Giaffer, j'étais d'abord parti sur le 


La mise en place d'un système d'annlulation (undo) s'avère très simple sous Angular.

Il suffit de garder dans le scope la donnée qui vient d'étre supprimée
On prépare le message pour le template, que l'on affiche que lorsque qu'une donnée vient d'être supprimée. 
Le message contient un lien dont l'action se contente d'enregistrer la donnée supprimée.

Dans le controleur : src/app/interests/interests.js

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

Dans le template (src/app/interests/interests.tpl.html): 

```html
<alert type="warning" ng-show="deletedInterest !== null" close="closeUndoDelete()">
        <strong>{{deletedInterest.name}}</strong> has been deleted.&nbsp;&nbsp;
        <a ng-click="undoDeleteInterest()">Undo</a>
</alert>


<i class="btn glyphicon glyphicon-trash" ng-click="deleteInterest(interest)"></i>
```

Le code complet est sur le projet Giaffer
