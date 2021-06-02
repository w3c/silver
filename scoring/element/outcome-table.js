import { html, define, store } from 'https://unpkg.com/hybrids@4.3.1/esm/index.js';
import Scoring, { updateOutcome, addResult, removeResult } from '../scoring.js'

export const OutcomeTable = {
  outcomeKey: '',
  outcome: ({ outcomeKey }) => {
    const { outcomes = [] } = store.get(Scoring)
    return outcomes.find(({ key }) => key === outcomeKey) || {}
  },
  results: ({ outcome }) => outcome.results,
  methods: ({ outcome }) => outcome.methods,

  render: ({ results = [], methods, outcomeKey }) => html`
    <table>
      <thead>${ tableHeadingRow({ outcomeKey }) }</thead>
      <tbody>
        ${results.map((result, resultIndex) => (
          tableDataRow({ outcomeKey, resultIndex, result, methods })
        ))}
      </tbody>
    </table>
    <button onclick=${addResult.bind(null, outcomeKey)}>Add a new view</button>
    <button onclick=${removeResult.bind(null, outcomeKey)}>Remove the bottom view</button>
    <style> @import url("styles/tables.css"); </style>
  `
}

export const tableHeadingRow = ({ outcomeKey }) => html`
  <tr>
    <th id="${outcomeKey}-view">URL or view name</th>
    <th id="${outcomeKey}-method">Method</th>
    <th id="${outcomeKey}-score">Percentage passed</th>
    <th id="${outcomeKey}-criticals">Number of critical errors</th>
    <th id="${outcomeKey}-rating">Rating</th>
  </tr>
`

export const tableDataRow = (props) => html`
  <tr>
    <td>${ input({ ...props, resultKey: 'view' }) }</td>
    <td>${ select({ ...props, resultKey: 'method' }) }</td>
    <td>${ input({ ...props, resultKey: 'score' }) }</td>
    <td>${ input({ ...props, resultKey: 'criticals' }) }</td>
    <td> <strong>${outcomeRating(props.result)}</strong> </td>
  </tr>
`

const input = ({ outcomeKey, resultIndex, resultKey, result }) => {
  const value = result[resultKey]
  const type = typeof value === 'number' ? 'number' : 'text'
  const labelledby = outcomeKey + '-' + resultKey
  const oninput = (_, event) => {
    let { value } = event.target
    if (type === 'number') {
      value = parseFloat(value.replace(',', '.')) || 0
    }
    updateOutcome({ outcomeKey, resultIndex, resultKey, value })
  }

  return html`
    <input type=${type} value=${value} oninput=${oninput} aria-labelledby=${labelledby} />
  `
}

const select = ({ outcomeKey, resultKey, result, methods }) => {
  const selected = result[resultKey]
  const labelledby = outcomeKey + '-' + resultKey
  
  const oninput = (_, event) => {
    const { value } = event.target
    updateOutcome({ outcomeKey, resultIndex, resultKey, value })
  }

  return html`
    <select aria-labelledby=${labelledby} oninput=${oninput}>
      ${methods.map((method = {}) => html`
        <option selected=${method.key === selected}>
          ${method.text}
        </option>
      `)}
    </select>
  `
}

export const outcomeRating = ({ rating }) =>  {
  const ratingMap = ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
  return `${ratingMap[rating]} (${rating})`
}

define({ OutcomeTable })