var sentiment = require('./index');
sentiment.load();

setTimeout(function(){ 
  console.log(sentiment.getSentiment('我喜歡你!'));
}, 3000);