import { html, define, store } from 'https://unpkg.com/hybrids@4.3.1/esm/index.js';
import Scoring from '../scoring.js'
import './outcome-table.js'

export const OutcomeSection = {
  outcomeKey: '',
  outcome: ({ outcomeKey }) => {
    const { outcomes = [] } = store.get(Scoring)
    return outcomes.find(({ key }) => key === outcomeKey)
  },

  render: ({ outcomeKey, outcome = {} }) => html`
    <section>
      <h3 id=${outcomeKey}>${outcome.text}</h3>
      <p>Functional categories: ${outcomeCategories(outcome)}</p>
      <outcome-table outcomeKey=${outcomeKey}></outcome-table>
      <p>${outcomeSummary(outcome)}</p>
    </section>      
  `
}

export const outcomeSummary = ({ text, averageRate, criticals }) => html`
  <em>${text}</em> 
  has an average rating of <strong>${averageRate}</strong>
  and <strong>${criticals}</strong> critical issues.
`

export const outcomeCategories = ({ functionalCategoryNames = [] }) => (
  functionalCategoryNames.map((name, index, arr) => html`
    <em>${name}</em>${index + 1 < arr.length ? ',' : ''}&nbsp;
  `.key(index))
)

define({ OutcomeSection })