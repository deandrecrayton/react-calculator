import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/react-toggle.css'
import './css/calculator.css';
import './css/log.css';
import './css/settings.css';
import './css/theme-settings.css'
import './css/themes.css';
import './css/responsive.css';
import ParticleWrapper from './ParticleWrapper';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ParticleWrapper />, document.getElementById('root'));
registerServiceWorker();
