/*****************************************************************************/
/* AllUsers Publish Functions
/*****************************************************************************/

Meteor.publish('all_users', function () {
  // you can remove this if you return a cursor
  return Meteor.users.find()
});