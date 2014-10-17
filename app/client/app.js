/*****************************************************************************/
/* Client App Namespace  */
/*****************************************************************************/
_.extend(App, {
});

App.helpers = {
};

App.translated = new ReactiveDict()

App.services = new GoogleTranslationService( "AIzaSyAwqacIvWne23Sf4j6Aap41mRJY99VOCyM" )

_.each(App.helpers, function (helper, key) {
  Handlebars.registerHelper(key, helper);
});