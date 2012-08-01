# Ember Twitter

Provides simple automation using the Twitter @anywhere API using Mixins.

Insipred by https://raw.github.com/luan/ember-facebook

# Usage

Include the mixin when you set up your application:

```javascript
App = Em.Application.create(Em.Twitter);
App.set('twAppId', 'YourAppId');
```

Then work with the App.TWUser object:

```html
{{#if App.TWUser}}
  ... some stuff with the twitter user info ...
{{else}}
  Hey you're not connected to twitter
{{/if}}
```