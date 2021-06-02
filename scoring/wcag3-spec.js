export default {
  bronzeMinimumScore: 3.5,
  
  functionalCategories: [{
    key: 'vision',
    text: 'Vision and Visual',
    outcomeKeys: ['alt-available']
  }, {
    key: 'sensory',
    text: 'Sensory Intersections',
    outcomeKeys: ['alt-available', 'clear-words']
  }, {
    key: 'phys-and-sense',
    text: 'Physical and Sensory Intersections',
    outcomeKeys: ['alt-available', 'clear-words']
  }, {
    key: 'coga-and-sense',
    text: 'Cognitive and Sensory Intersections',
    outcomeKeys: ['alt-available', 'clear-words']
  }],

  outcomes: [{
    key: 'alt-available',
    text: 'Text alternative available',
    ratingMap: [50, 60, 80, 95]
  }, {
    key: 'clear-words',
    text: 'Uses common and clear words in all content',
    ratingMap: [1, 1.6, 1.6, 1.7]
  }],

  methods: [{
    key: 'img-functional',
    outcomeKey: 'alt-available',
    text: 'Text Alternatives for Functional Images (HTML)'
  }, {
    key: 'text-img',
    outcomeKey: 'alt-available',
    text: 'Text Alternatives for Images of Text (HTML)'
  }, {
    key: 'clear-words-all',
    outcomeKey: 'clear-words',
    text: 'Use Clear Words (All)'
  }]
}
