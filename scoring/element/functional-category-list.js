import { html, define, store } from 'https://unpkg.com/hybrids@4.3.1/esm/index.js';
import Scoring from '../scoring.js'

export const FunctionalCategoryList = {
  functionalCategories: () => store.get(Scoring).functionalCategories,
  render: ({ functionalCategories }) => html`
    <ul>${ functionalCategories.map((category) => html`
      <li> <details>
        <summary>${ functionalSummary(category) }</summary>
        <ul>${ category.outcomes.map(outcomeLi) }</ul>
      </details> </li>
    `)}</ul>
    <style>
      ul { list-style: none; }
      li > details > ul { list-style: circle; }
    </style>
  `
}

const functionalSummary = ({ text, outcomeAverage }) => html`
  <span>${ text }:</span>&nbsp;
  <em>${ outcomeAverage }</em>
`;

const outcomeLi = ({ key, text, averageRate }) => html`
  <li>
    <a href="#${key}">${text}:</a>&nbsp;
    <em>${averageRate}</em>
  </li>
`;

define({ FunctionalCategoryList });
