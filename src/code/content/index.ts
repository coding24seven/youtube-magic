import { compensateForFirefoxBugs } from './utils';
import Filter from './filter';
import './styles.scss';
import { loadFilters, loadOptions } from '../browser-api';

compensateForFirefoxBugs();

async function main() {
  const filters = await loadFilters();
  const options = await loadOptions();

  new Filter(filters, options);
}

void main();
