---
title: User errors management in Angular.js
date: 2014-05-28
tags: angularjs, ux, javascript
lang: en
template: en/post.jade
---

When designing a web interface allowing data deletion, one often add a security layer by asking the user to confirm his action.

This is not an ideal method for the user: his work is interrupted by a dialog box which is irrelevant most of the time  (it is relevant only when he actually make an error). He is slowed by the necessity to validate twice and suffer the stress of this micro-anxiety box. Furthermore, in a session of repeated deletions, he can make a habit of systematically validating twice, not paying anymore attention to the warning window, rendering it ineffective.

I favor a less intrusive solution: the immediate removal, without prompting, but with the option to cancel the action if an error occurs. This streamlines the workflow and the user knows he can always go back.

![Undo deletion in Giaffer](/images/posts/Giaffer_undo.png "Undo deletion in Giaffer")


The implementation of a cancellation system is very simple in Angular:

When removing an item, we retains its data in the scope.

In the template, we know if an item has been removed by checking for its data in the scope, if this is the case, we display a message containing a link whose action simply re-record the item from the data retained.


I used this method in the [Giaffer](http://mmai.github.io/giaffer/) "interests" admin page. Here is what the controller looks like ([app/interests/interests.js](https://github.com/mmai/giaffer/blob/master/src/app/interests/interests.js)) :

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
  
In the template ([app/interests/interests.tpl.html](https://github.com/mmai/giaffer/blob/master/src/app/interests/interests.tpl.html)) I use the [alert](http://angular-ui.github.io/bootstrap/#/alert) directive from Angular Bootstrap.  

```html
<alert type="warning" ng-show="deletedInterest !== null" close="closeUndoDelete()">
        <strong>{{deletedInterest.name}}</strong> has been deleted.&nbsp;&nbsp;
        <a ng-click="undoDeleteInterest()">Undo</a>
</alert>


<i class="btn glyphicon glyphicon-trash" ng-click="deleteInterest(interest)"></i>
```

The complete application code is available on Github : [Giaffer](https://github.com/mmai/giaffer)
