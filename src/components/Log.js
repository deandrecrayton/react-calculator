import React from "react";
import FontAwesome from '@fortawesome/react-fontawesome';
import faCalculator from '@fortawesome/fontawesome-free-solid/faCalculator';
import toHtml from 'html-react-parser';

function Log(props) {
  return (
    <div className="log">
      <h2><FontAwesome icon={faCalculator} />Calculations:</h2>

      <ul>
        {props.log.map((entry, i) => {
          return (
            <li className="entry" 
              key={i} onClick={props.onClick} 
              data-answer-exact={entry.answer.exact}
              data-answer-display={entry.answer.display}>
              <span className="equation">{toHtml(entry.equation.replace(/\^2/g, '<sup>2</sup>'))}</span>
              <span className="answer">{entry.answer.rounded}</span>
            </li>
          );
        }).reverse()}
      </ul>
    </div>
  );
}

export default Log;
