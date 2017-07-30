const NLP = require('natural');
const sentiment = require('sentiment');
const fs = require('fs');

module.exports = class Bot {
  constructor(db, client) {
    this.classifier = new NLP.LogisticRegressionClassifier();
    this.db = db;
    this.client = client;
    this.hashPath = './imports/hash.hash';
    this.phrasesPath = './imports/phrases.json';
    this.classifierPath = './imports/classifier.json';
    this.minConfidence = 0.9;
    this.isCorrectHash();
  }
  
  init() {
    this.client.on('message', (message) => {
      const regex = /^(how|when|is|which|what|whose|who|whom|where|why|can)(.*)|([^.!?]+\?)/igm;
  
      const isQuestion = regex.test(message.content);
      const isCommand = message.content.charAt(0) === '!';
      if (isQuestion) {
        const interpretation = this.interpret(message.content);
  
        if (interpretation.guess) {
          console.log('invoking skill', interpretation.guess);
          this.invoke(interpretation.guess, message);
        }
      }
      if (isCommand) {
        const command = message.content.substr(1).toLocaleLowerCase();
        console.log('Command', command);
        fs.exists(`./imports/commands/${command}.js`, (exists) => {
          if (exists) {
            require(`./imports/commands/${command}.js`)(this.client, message);
            message.delete()
              .then(msg => console.log(`Deleted message from ${msg.author}`))
              .catch(console.error);
          }
        });
        
      }
    });
  
    this.client.login('CLIENT_ID');
  }
  
  interpret(phrase) {
    const guesses = this.classifier.getClassifications(phrase.toLowerCase());
    const guess = guesses.reduce(this.toMaxValue);
    console.log(guess);
    return {
      probabilities: guesses,
      guess: guess.value > this.minConfidence ? guess.label : null
    };
  }
  
  invoke(skill, message) {
    fs.readFile(this.phrasesPath, function(err, data) {
      const phrases = JSON.parse(data);
      if(phrases[skill]) {
        message.channel.send(phrases[skill]);
      } else {
        console.log('skill not found ', skill);
      }
    })
  }
  
  teach(label, phrases) {
    phrases.forEach((phrase) => {
      this.classifier.addDocument(phrase.toLowerCase(), label);
    });
    
  }
  
  learn() {
    const phrases = this.db.collection('phrases');
    
    phrases.find({}).toArray((err, docs) => {
      const phraseObj = {};
      const customPhrases = {};
      docs.forEach(phrase => {
        phraseObj[phrase.skill] = phrase.answer;
        this.teach(phrase.skill, phrase.phrases)
      });
      
      this.savePrases(phraseObj);
      
      this.classifier.train();
  
      this.classifier.save(this.classifierPath, (err) => {
        console.log('customPhrases', err);
      });
    });
  }
  
  isCorrectHash() {
    const hashes = this.db.collection('hashes');
    const hash = hashes.findOne({name: "phrases"});
    const path = fs.realpathSync(this.hashPath);
    const localHash = fs.readFileSync(path, 'utf8');
  
    if(hash.hash !== localHash) {
      this.learn();
    }
  }
  
  savePrases(phrases) {
    fs.writeFileSync(this.phrasesPath, JSON.stringify(phrases));
  }
  
  toMaxValue(x, y) {
    return x && x.value > y.value ? x : y;
  }
};