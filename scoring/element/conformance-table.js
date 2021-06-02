import { html, define, store } from 'https://unpkg.com/hybrids@4.3.1/esm/index.js';
import Scoring from '../scoring.js'
import wcag3Spec from '../wcag3-spec.js'

export const ConformanceTable = {
  criticals: () => store.get(Scoring).criticals,
  lowestScore: () => store.get(Scoring).lowestScore,
  hasBronze: () => store.get(Scoring).hasBronze,
  bronzeMinimum: () => wcag3Spec.bronzeMinimumScore,

  render: ({ criticals, lowestScore, hasBronze, bronzeMinimum}) => html`
    <table>
      ${ row('Minimum required score for Bronze:', bronzeMinimum) }
      ${ row('Lowest functional category score:', lowestScore) }
      ${ row('Critical errors:', criticals) }
      ${ row('Conformance to Bronze:', hasBronze ? 'yes' : 'no') }
    </table>
    <style> @import url("styles/tables.css"); </style>
  `
};

const row = (heading, data) => html`
  <tr> <th>${ heading }</th> <td>${ data }</td> </tr>
`

define({ ConformanceTable })