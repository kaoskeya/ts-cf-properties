GoogleTranslationService = function(api_key) {

  this._base_url = "https://www.googleapis.com/language/translate/v2"
  this._api_key = api_key
}


GoogleTranslationService.prototype = {

  __call__ : function(method, path, options, callback){
    var url = this._build_url(path)

    if (! callback && typeof options === "function") {
        // support (method, url, callback) argument list
        callback = options;
        options = null;
    }
    options = options || {};
    options['params'] = options['params'] || {}
    options['params']['key'] = this._api_key
    return HTTP.call(method, url, options, callback);

  },


  _build_url : function(path){
    return [this._base_url, path].join('')
  },


  translate : function(text, source, target, callback){

    this.__call__("GET", "", {params : {
      q : text,
      source : source,
      target : target
    }}, function(err, result) {
      callback(err, result.data.data.translations[0])
    })

  },

  detect : function(text, callback){

    this.__call__("GET", "/detect", {params : {
      q : text
    }}, function(err, result) {
      callback(err, result.data.data.detections[0][0])
    })
  },

  detect_translate : function(text, target, callback){
    var self = this
    self.detect(text, function(err, result) {
      var source = result.language
      self.translate(text, source, target, callback)
    })
  },

  languages : function(callback){
    this.__call__("GET", "/languages", callback)
  }

}
