'use strict';

var exports = module.exports = {};
var lineReader = require('line-reader');
var nodejieba = require('nodejieba');
var _ = require('lodash')
var stopwords = require('./stopwords')
var indico = require('./indico');

var ivyDict = null;
var isLoaded = false;

function skip(word) {
  return word.match(/[0-9a-zA-Z]+/);
}

var getSentiment = function(sentence) {
  var words = nodejieba.cut(sentence);
  var score = 0;
  for (var i=0; i<words.length; i++) {
    if (ivyDict[words[i]]) {
      score += ivyDict[words[i]];
    }
  }
  return score/words.length;
};

var getMixSentiment = function (sentence, cb) {
  var score = getSentiment(sentence) || 0;
  indico.getScore(sentence, function (err, indico_score) {
    if (err) return cb(err);
    cb(null, score + indico_score);
  });
};

var load = function() {
  if (!ivyDict) {
    ivyDict = {};
    console.log('start loading ..');
    lineReader
      .eachLine(__dirname + '/corpus/ivy.txt', function(line){
        var arr = line.split(' ');
        ivyDict[arr[0]] = arr[1];
      })
      .then(function(err) {
        if (err) throw err;
      });
  }
};

var training = function() {
  var dict = {};
  lineReader
    .eachLine('./corpus/roger/roger.txt', function(line){
      var result = nodejieba.cut(line);
      for (var i=0; i< result.length; i++) {
        var word = result[i];

        if (_.contains(stopwords.list, word) || skip(word)) continue;

        if(!dict[word]) dict[word] = 1;
        else dict[word]++;
      }
    })
    .then(function(err) {
      if (err) throw err;
      console.log("I'm done!!");

      var sortable = [];
      for (var word in dict) {
        if (dict[word] >= 3) {
          sortable.push([word, dict[word]])
        }
      }
      sortable.sort(function(a, b) {return b[1] - a[1]})
    });
};

// loadCorpus();
// var score = getSentiment('我喜歡你!');
// console.log(score);

exports.load = load;
exports.getSentiment = getSentiment;
exports.getMixSentiment = getMixSentiment;
