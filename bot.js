const NLP = require('natural');
const sentiment = require('sentiment');
const fs = require('fs');

module.exports = class Bot {
  constructor(db, client, botApiKey) {
    this.botApiKey = botApiKey;
    this.classifier = new NLP.LogisticRegressionClassifier();
    this.db = db;
    this.client = client;
    this.hashPath = './imports/hash.hash';
    this.phrasesPath = './imports/phrases.json';
    this.classifierPath = './imports/classifier.json';
    this.minConfidence = 0.9;
    if(db !== false) this.isCorrectHash();
  }
  
  init() {
    this.client.on('message', (message) => {
      const regex = /^(how|when|is|which|what|whose|who|whom|where|why|can)(.*)|([^.!?]+\?)/igm;
      
      const isQuestion = regex.test(message.content);
      const isCommand = message.content.charAt(0) === '!';
      if (isQuestion && this.db !== false) {
        const interpretation = this.interpret(message.content);
        
        if (interpretation.guess) {
          const [command] = message.content.substr(1).toLocaleLowerCase().split(' ');
          
          const id = 'ignore|' + interpretation.guess + '|' + message.author.username;
          const ignore = this.db.collection('ignore');
          ignore.findOne({id: id})
            .then((doc, err) => {
              if (!doc) {
                this.invoke(interpretation.guess, message);
              }
            })
            .catch(err => {
              this.invoke(interpretation.guess, message);
            });
        }
      }
      if (isCommand) {
        const command = message.content.substr(1).toLocaleLowerCase().split(' ')[0];
        fs.exists(`./imports/commands/${command}.js`, exists => {
          if (exists) {
            require(`./imports/commands/${command}.js`)(this.client, message, this.db);
            message.delete()
              .then(msg => console.log(`Deleted message from ${msg.author}`))
              .catch(console.error);
          }
        });
        
      }
    });
    
    this.client.login(this.botApiKey);
  }
  
  interpret(phrase) {
    const guesses = this.classifier.getClassifications(phrase.toLowerCase());
    const guess = guesses.reduce(this.toMaxValue);
    
    return {
      probabilities: guesses,
      guess: guess.value > this.minConfidence ? guess.label : null
    };
  }
  
  invoke(skill, message) {
    fs.readFile(this.phrasesPath, function (err, data) {
      const phrases = JSON.parse(data);
      if (phrases[skill]) {
        message.author.send(phrases[skill], {
          embed: {
            fields: [{
              name: 'To ignore this message copy/paste the line below in the chat',
              value: '!ignore ' + skill,
              inline: true
            }]
          }
        });
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
    
    if (hash.hash !== localHash) {
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