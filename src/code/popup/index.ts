import { createRoot } from 'react-dom/client';
import App from './App';
import { createElement } from 'react';
import './styles.scss';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(createElement(App));
}
