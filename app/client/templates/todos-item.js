var EDITING_KEY = 'EDITING_TODO_ID';

Template.todosItem.helpers({
  checkedClass: function() {
    return this.checked && 'checked';
  },
  editingClass: function() {
    return Session.equals(EDITING_KEY, this._id) && 'editing';
  },
  userInfo: function() {
    return this.emails[0].address
  },
  userID: function() {
    return this._id
  },
  messages: function() {
    var self = this;
    console.log( Blaze._parentData(1)._id )
    var messages = Lists.findOne({ _id: Blaze._parentData(1)._id }).messages
    return _.filter( messages, function(msg){ return msg.thread == self._id } )
  },
  messageFrom: function() {
    return (this.from == Meteor.userId())?'pull-right alert-info':'alert-success';
  },
  localMessage: function(msg){
    var l = Session.get('currentLangaugeCode')
    var a = App.translated.get(l + '_' +msg)
    if( a ) {
      return a
    } else {
      console.log(msg)
      App.services.detect_translate( msg, l, function(error, result){
        App.translated.set(l + '_' +msg, result.translatedText)
      } )
      return msg
    }
  }
});

Template.todosItem.events({
  'submit #sendMessage': function(e, tmpl){
    e.preventDefault()
    e.stopPropagation()
    Lists.update(
      { _id: Blaze._parentData(1)._id }, 
      { $push : { 
        messages : { 
          message: $( '#' + tmpl.data._id + '_message' ).val() ,
          timestamp: moment().unix(),
          from: Meteor.userId(),
          thread: this._id
        }
      } 
    })
    $("#sendMessage").trigger('reset')
  },
  'change [type=checkbox]': function(event) {
    var checked = $(event.target).is(':checked');
    Todos.update(this._id, {$set: {checked: checked}});
    Lists.update(this.listId, {$inc: {incompleteCount: checked ? -1 : 1}});
  },
  
  'focus input[type=text]': function(event) {
    Session.set(EDITING_KEY, this._id);
  },
  
  'blur input[type=text]': function(event) {
    if (Session.equals(EDITING_KEY, this._id))
      Session.set(EDITING_KEY, null);
  },
  
  'keydown input[type=text]': function(event) {
    // ESC or ENTER
    if (event.which === 27 || event.which === 13) {
      event.preventDefault();
      event.target.blur();
    }
  },
  
  // update the text of the item on keypress but throttle the event to ensure
  // we don't flood the server with updates (handles the event at most once 
  // every 300ms)
'keyup input[type=text]': _.throttle(function(event) {
  Todos.update(this._id, {$set: {text: event.target.value}});
}, 300),

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-delete-item, click .js-delete-item': function() {
    Todos.remove(this._id);
    if (! this.checked)
      Lists.update(this.listId, {$inc: {incompleteCount: -1}});
  }
});