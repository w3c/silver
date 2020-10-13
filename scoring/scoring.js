import { store } from 'https://unpkg.com/hybrids@4.3.1/esm/index.js';
import { storeOutcome, createResult } from './scoring/outcomes.js'
import wcag3Spec from './wcag3-spec.js'

const Scoring = {
  outcomes: wcag3Spec.outcomes.map(storeOutcome),
  functionalCategories: wcag3Spec.functionalCategories.map(storeFunctionalCategories),
  criticals: ({ outcomes }) => {
    return outcomes.reduce((sum, { criticals }) => sum + criticals, 0)
  },
  lowestScore: ({ functionalCategories }) => {
    const scores = functionalCategories.map(({ outcomeAverage }) => outcomeAverage)
    return Math.min(...scores);
  },
  hasBronze: ({ criticals, lowestScore }) => {
    return criticals === 0 && lowestScore >= wcag3Spec.bronzeMinimumScore
  }
};

function storeFunctionalCategories(category) {
  return {
    ...category,
    outcomes({ outcomeKeys }) {
      const { outcomes } = store.get(Scoring)
      return outcomes.filter(({ key }) => outcomeKeys.includes(key))
    },
    outcomeAverage({ outcomes }) {
      if (outcomes.length === 0) {
        return 0;
      }
      const sum = outcomes.reduce((sum, { averageRate }) => sum + averageRate, 0) || 0;
      return sum / outcomes.length;
    }
  }
}

export function updateOutcome({ outcomeKey, resultIndex, resultKey, value }) {
  let { outcomes } = store.get(Scoring)
  outcomes = replaceOutcome(outcomes, outcomeKey, outcome => ({
      results: outcome.results.map((result, index) => (
        index !== resultIndex ? result : { 
          ...result,
          [resultKey]: value 
        }
      )),
    }
  ))
  store.set(Scoring, { outcomes })
}

export function addResult(outcomeKey) {
  let { outcomes } = store.get(Scoring)
  outcomes = replaceOutcome(outcomes, outcomeKey, outcome => ({
    results: [
      ...outcome.results,
      createResult(outcome)
    ]
  }))
  store.set(Scoring, { outcomes })
}

export function removeResult(outcomeKey) {
  let { outcomes } = store.get(Scoring)
  outcomes = replaceOutcome(outcomes, outcomeKey, ({ results }) => ({
    results: results.slice(0, results.length - 1)
  }))
  store.set(Scoring, { outcomes })
}

function replaceOutcome(outcomes, outcomeKey, cb) {
  return outcomes.map(outcome => (
    outcome.key !== outcomeKey ? outcome : {
      ...outcome,
      ...cb(outcome),
    }
  ))
}

export default Scoring;
