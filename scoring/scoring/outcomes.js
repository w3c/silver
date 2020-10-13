import wcag3Spec from '../wcag3-spec.js'

export function createResult({ ratingMap }) {
  return {
    ratingMap,
    view: 'https://',
    selectedMethod: '',
    score: ratingMap[ratingMap.length -1],
    criticals: 0, 
    rating: ({ criticals, score, ratingMap }) => {
      if (criticals) {
        return 0;
      }
      for (let i = ratingMap.length; i >= 0; i--) {
        if (score >= ratingMap[i - 1]) {
          return i
        }
      }
      return 0;
    }
  }
}

function outcomeMapping({ key }) {
  const methods = wcag3Spec.methods.filter(({ outcomeKey }) => outcomeKey === key)
  const functionalCategories = wcag3Spec.functionalCategories.filter(({ outcomeKeys }) => (
    outcomeKeys.includes(key)
  )).map(({ key }) => key)

  return { methods, functionalCategories }
}

function outcomeGetters() {
  return {
    averageRate: ({ results }) => {
      if (results.length === 0) {
        return 4;
      }
      const sum = results.reduce((sum, { rating }) => sum + rating, 0)
      return Math.round((sum / results.length) * 10) / 10;
    },
    criticals: ({ results }) => {
      return results.reduce((sum, { criticals }) => sum + criticals, 0) || 0;
    },
    functionalCategoryNames({ functionalCategories }) {
      return functionalCategories.map(key => {
        return wcag3Spec.functionalCategories.find(category => category.key === key).text
      })
    }
  }
}

export function storeOutcome(outcome) {
  return {
    ...outcome,
    ...outcomeMapping(outcome),
    ...outcomeGetters(),
    results: [createResult(outcome)]
  }
}
