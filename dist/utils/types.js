export var WordCount;
(function (WordCount) {
  WordCount[(WordCount['WORDS12'] = 12)] = 'WORDS12';
  WordCount[(WordCount['WORDS15'] = 15)] = 'WORDS15';
  WordCount[(WordCount['WORDS18'] = 18)] = 'WORDS18';
  WordCount[(WordCount['WORDS21'] = 21)] = 'WORDS21';
  WordCount[(WordCount['WORDS24'] = 24)] = 'WORDS24';
})(WordCount || (WordCount = {}));
export var Network;
(function (Network) {
  Network['Testnet'] = 'testnet';
  Network['Regtest'] = 'regtest';
  Network['Bitcoin'] = 'bitcoin';
  Network['Signet'] = 'signet';
})(Network || (Network = {}));
export var EntropyLength;
(function (EntropyLength) {
  EntropyLength[(EntropyLength['Length16'] = 16)] = 'Length16';
  EntropyLength[(EntropyLength['Length24'] = 24)] = 'Length24';
  EntropyLength[(EntropyLength['Length32'] = 32)] = 'Length32';
})(EntropyLength || (EntropyLength = {}));
<<<<<<< HEAD
export var KeychainKind;
=======
var KeychainKind;
>>>>>>> 5d9200b (refactor: typescript bindings)
(function (KeychainKind) {
  KeychainKind['External'] = 'EXTERNAL';
  KeychainKind['Internal'] = 'INTERNAL,';
})(KeychainKind || (KeychainKind = {}));
export var AddressIndexVariant;
(function (AddressIndexVariant) {
  AddressIndexVariant['NEW'] = 'NEW';
  AddressIndexVariant['LAST_UNUSED'] = 'LAST_UNUSED';
  // PEEK = 'PEEK',
  // RESET = 'RESET',
})(AddressIndexVariant || (AddressIndexVariant = {}));
//# sourceMappingURL=types.js.map
