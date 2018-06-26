import React, { Component } from 'react';
import Settings from './Settings';
import Log from './Log';
import math from 'mathjs';
import toHtml from 'html-react-parser';

class Calculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equation: {
        exact: '0',
        display: '0'
      },
      answer: {
        exact: '',
        display: '',
        rounded: ''
      },
      log: [],
      allClear: false,
      warning: '',
      actionKey: false,
      settings: {
        degrees: false,
        ln: false
      }
    }

    this.numbers = [];
    for (var i = 0; i <= 9; i++) this.numbers.push(i.toString());
    
    this.constants = ['π', 'e'];
    this.operators = [' + ', ' - ', ' × ', ' ÷ '];
    this.validKeys = [...this.numbers, '.', '+', '-', '*', '/', '^', 'l', 's', 'c', 't', 'e', 'p', 'r', '(', ')', '=', 'Backspace', 'Enter'];

    math.config({ number: 'Fraction' });
  }

  componentDidMount() {
    document.getElementById('keyboard-input').focus({ preventScroll: true });
  }

  handleInput = (e) => {  
    e.preventDefault();
    let val = e.key || e.target.value;

    this.setState((prevState) => {
      let exact = prevState.equation.exact;
      let display = prevState.equation.display;
      let last = display.slice(-1);
      let lastTwo = display.slice(-2);
      let leftCount = display.split('').filter(char => char === '(').length;
      let rightCount = display.split('').filter(char => char === ')').length;;

      /* For mantaining equivalent equations */
      if (display === prevState.answer.display && ![...this.operators, '^2'].includes(val)) {
        exact = '';
        display = '';
      }

      /* Zeroes, decimals & negatives */
      if (display === '0') {
        if (val === '0') {
          val = ''; 
        } else if (val === '.') {
          val = '';
          exact = '0.';
          display = '0.';
        } else if (val === ')') {
          val = '';
          exact = '0';
          display = '0';
        } else if (val === ' - ') {
          val = '';
          exact = '-';
          display = '-';
        } else if (![...this.operators, '^2'].includes(val)) {
          exact = '';
          display = '';
        }
      }

      if ( (lastTwo === ' 0' && ![...this.operators, '.'].includes(val)) ||
           (val === '.' && last === '.')) {
        val = '';
      }

      /* Implicit multiplication */
      if ( (this.constants.includes(last) && this.numbers.concat(this.constants).includes(val)) ||
           (last === ')' && this.numbers.includes(val))) {
        val = ' × ' + val;
      }

      /* Exponent */
      if (![...this.numbers, ...this.constants, ')'].includes(last) && val === '^2') {
        val = '';
      }

      if (lastTwo === '^2' && val === '^2') {
        val = '';
      }
      
      /* Operators & parentheses */
      if (this.operators.includes(val)) {
        if (last === ' ') {
          exact = exact.slice(0, -3) + val;
          display = display.slice(0, -3) + val;
          val = '';
        } else if (last === '(') {
          val = val === ' - ' ? '-' : '';
        }
      }

      if ( (val === ')' && (rightCount === leftCount || [' ', '('].includes(last))) ||
           (last === '-' && this.operators.includes(val))) {
        val = '';
      }

      return {
        equation: {
          exact: this.parseSpacing(exact + val),
          display: this.parseSpacing(display + val)
        },
        allClear: false
      }
    });
  }

  keyboardInput = (e) => {
    if (/Meta|Control/.test(e.key)) {
      let actionKey = e.type === 'keydown' ? true : false; 
      this.setState({ actionKey });
    }

    if (e.type === 'keydown') {
      if (this.validKeys.includes(e.key) && !this.state.actionKey) {
        if (e.key === 'Backspace') return this.clear(e);
        if (/=|Enter/.test(e.key)) return this.evaluate(e);
  
        e.key = e.key.replace(/[+\-*/]/g, ' $& ')
        .replace('*', '×')
        .replace('/', '÷')
        .replace('l', 'log(')
        .replace('s', 'sin(')
        .replace('c', 'cos(')
        .replace('t', 'tan(')
        .replace('p', 'π')
        .replace('r', '√(')
        this.handleInput(e);
      }
    }
  }

  clear = (e) => {
    e.preventDefault();

    let deleteChars = (exact = '0', display = '0', by) => {
      if (parseInt(by, 10) > 0) {
        return { 
          equation: {
            exact: exact.slice(0, -by) || '0',
            display: display.slice(0, -by) || '0',
          }
        }
      } else {
        return { equation: { exact, display } }
      }
    }

    if (this.state.allClear === true) {
      return this.setState({
        equation: deleteChars().equation,
        allClear: false
      });
    }
    
    this.setState((prevState) => {
      let exact = prevState.equation.exact;
      let display = prevState.equation.display;

      /* For mantaining equivalent equations */
      if (display === prevState.answer.display) return deleteChars();
      
      /* For operators */
      if (display.slice(-1) === ' ') return deleteChars(exact, display, 3);

      /* For exponents */
      if (display.slice(-2) === '^2') return deleteChars(exact, display, 2);

      /* For functions, i.e sin() cos() ln() with an extra space from implicit multiplication */
      if (/ sqrt\(/g.test(display.slice(-6))) return deleteChars(exact, display, 6);

      if (/ sin\(| cos\(| tan\(| log\(/g.test(display.slice(-5))) return deleteChars(exact, display, 5);

      if (/ ln\(/g.test(display.slice(-4))) return deleteChars(exact, display, 4);

      /* For functions, i.e sin() cos() ln() */
      if (/sqrt\(/g.test(display.slice(-5))) return deleteChars(exact, display, 5);
      
      if (/sin\(|cos\(|tan\(|log\(/g.test(display.slice(-4))) return deleteChars(exact, display, 4);

      if (/ln\(/g.test(display.slice(-3))) return deleteChars(exact, display, 3);

      /* CE - one digit at a time */
      return deleteChars(exact, display, 1);
    });
  }

  parseSpacing = (equation) => equation.replace(/(\d+|e|π)(s|c|t|l|√\()/g, (m, p1, p2) => p1 + ' ' + p2)
  .replace(/(\^2)(\d|e|π)/g, (m, p1, p2) => p1 + ' × ' + p2)
  .replace('undefined', '');

  parseFnGrouping = (equation) => {
    let equationArray = equation.split('');
    let leftCount = equationArray.filter(char => char === '(').length;
    let rightCount = equationArray.filter(char => char === ')').length;

    while (rightCount >= leftCount) {
      let char = equationArray.pop();

      if (char === ')' || char === undefined) rightCount--;
    }

    return equationArray.join('') + ')';
  }

  parse = (equation) => equation.replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, '(pi)')
    .replace(/√/g, 'sqrt')
    .replace(/log/g, 'log10')
    .replace(/ln/g, 'log')
    .replace(/\(*-?(?:sin|cos|tan|log10|log|sqrt)\(.*\)|e|pi/g, (expr) => {
      if (!/e|pi/g.test(expr)) {
        expr = this.parseFnGrouping(expr);
      }

      math.config({ number: 'number' });
      let res = math.round(math.eval(expr), 15);
      math.config({ number: 'Fraction' });

      return `(${res})`;
    });

  parseDisplay = () => this.state.equation.display.replace(/\^2/, '<sup>2</sup>');

  setTrigUnit = (degrees) => {
    this.setState((prevState) => ({
      settings: {
        degrees,
        ln: prevState.settings.log
      }
    }));
  }

  setLog = (ln) => {
    this.setState((prevState) => ({
      settings: {
        degrees: prevState.settings.degrees,
        ln
      }
    }));
  }

  evaluate = (e) => {
    e.preventDefault();
    let display = this.state.equation.display; 
    let leftCount = display.split('').filter(char => char === '(').length;
    let rightCount = display.split('').filter(char => char === ')').length;
    let setError = () => {
      let answer = {
        exact: 'Error',
        display: 'Error',
        rounded: 'Error'
      };

      this.setState((prevState) => ({
        answer,
        log: [...prevState.log, { equation: prevState.equation.display, answer }],
        allClear: true
      }));
    }

    if (/ |\(|-/g.test(display.slice(-1)) || leftCount !== rightCount) {
      return this.setState({ warning: 'warning' }, () => {
        setTimeout(() => { this.setState({ warning: '' }) }, 600);
      });
    } else if (display.includes('(-)')) {
      return setError();
    }

    let equation = this.parse(this.state.equation.exact);
    let evaluation = 0;

    try {
      evaluation = math.eval(equation);
    } catch (error) {
      return setError();
    }

    let answer = {
      exact: '(' + math.format(evaluation) + ')',
      display: math.format(math.complex(evaluation), { precision: 14 }),
      rounded: math.round(evaluation, 5).toString(),
    }

    this.setState((prevState) => ({
      equation: {
        exact: answer.exact,
        display: answer.display
      },
      answer,
      log: [...prevState.log, {
        equation: prevState.equation.display,
        answer }],
      allClear: true
    }));
  }

  setEquationFromLog = (e) => {
    let answer = {
      exact: e.currentTarget.dataset.answerExact,
      display: e.currentTarget.dataset.answerDisplay
    };

    this.setState({
      equation: {
        exact: answer.exact,
        display: answer.display
      },
      answer: answer,
      allClear: true
    });
  }

  render() {
    let log = this.state.settings.ln ? 'ln' : 'log';
    let display = this.state.equation.display.replace(/\^2/g, '<sup>2</sup>');

    return (
      <main id="keyboard-input" tabIndex="1" onKeyDown={this.keyboardInput} onKeyUp={this.keyboardInput}>
        <form className="calculator">
          <output className={this.state.warning}><span className="output-text">{toHtml(display)}</span></output>

          <button onClick={this.clear} className="clear">{this.state.allClear ? 'AC' : 'CE'}</button>

          <fieldset className="grouping">
            <button onClick={this.handleInput} value="(">(</button>
            <button onClick={this.handleInput} value=")">)</button>
          </fieldset>

          <fieldset className="numbers">
            <button onClick={this.handleInput} value="1">1</button>
            <button onClick={this.handleInput} value="2">2</button>
            <button onClick={this.handleInput} value="3">3</button>

            <button onClick={this.handleInput} value="4">4</button>
            <button onClick={this.handleInput} value="5">5</button>
            <button onClick={this.handleInput} value="6">6</button>

            <button onClick={this.handleInput} value="7">7</button>
            <button onClick={this.handleInput} value="8">8</button>
            <button onClick={this.handleInput} value="9">9</button>
            
            <button onClick={this.handleInput} value="0">0</button>
            <button onClick={this.handleInput} value=".">.</button>
            <button onClick={this.evaluate} className="equals">=</button>
          </fieldset>

          <fieldset className="operators">  
            <button onClick={this.handleInput} value=" &divide; ">&divide;</button>
            <button onClick={this.handleInput} value=" &times; ">&times;</button>
            <button onClick={this.handleInput} value=" - ">-</button>
            <button onClick={this.handleInput} value=" + ">+</button>
          </fieldset>

          <fieldset className="trig">
            <button onClick={this.handleInput} value="&pi;">&pi;</button>
            <button onClick={this.handleInput} value="sin(">sin</button>
            <button onClick={this.handleInput} value="cos(">cos</button>
            <button onClick={this.handleInput} value="tan(">tan</button>
          </fieldset>

          <fieldset className="exponential">
            <button onClick={this.handleInput} value="e">e</button>
            <button onClick={this.handleInput} value={`${log}(`}>{log}</button>
            <button onClick={this.handleInput} value='^2'>x<sup>2</sup></button>
            <button onClick={this.handleInput} value="&radic;(">&radic;</button>
          </fieldset>
        </form>

        <Log log={this.state.log} onClick={this.setEquationFromLog} />
        
        <Settings setTrigUnit={this.setTrigUnit} setLog={this.setLog} />
      </main>
    );
  }
}

export default Calculator;
