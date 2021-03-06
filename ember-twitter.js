Ember.Twitter = Ember.Mixin.create({
  TWUser: void 0,
  twAppId: void 0,
  
  twAppIdChanged: function(){
    var appId = this.get('twAppId');
    this.set('_twInitPollingTime', null);
    var self = this;
    this.set('TWLoading', true);
    $(function(){
      var js = document.createElement('script');
      $(js).attr({
        src: "//platform.twitter.com/anywhere.js?id=%@&v=1".fmt(appId)
      });
      $('head').append(js);
      self._pollForInitComplete();
    });
  }.observes('twAppId'),

  updateTWUser: function(user){
    var self = this;
    if(user){
      this.set('TWUser', Ember.Object.create(user));
      return;
    }
    twttr.anywhere(function (T) {
      if(T.isConnected()){
        self.set('TWUser', Ember.Object.create(T.currentUser));
      }else{
        self.set('TWUser', null);
      }
    });
  },

  initComplete: function(){
    var self = this;
    this.set('TWLoading', false);
    this.updateTWUser();
    twttr.anywhere(function (T) {
      T.bind("authComplete", function (e, user) {
        self.updateTWUser(user);
      });
      
      T.bind("signOut", function (e) {
        self.updateTWUser();
      });
    });
  },

  initFailed: function(){
    this.set('TWLoading', false);
    if (window.console){
      console.log('Failed to load twitter @anywhere after 4 seconds');
    }
  },

  _pollForInitComplete: function(){
    var startTime = this.get('_twInitPollingTime');
    if(!startTime){
      startTime = new Date();
      this.set('_twInitPollingTime', startTime);
    }
    var now = new Date();
    if(window.twttr){
      this.initComplete();
    }else if((now - startTime) < 4000){
      Em.run.later(this, function(){
        this._pollForInitComplete();
      }, 20);
    }else{
      this.initFailed();
    }
  }
});