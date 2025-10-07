import { compensateForFirefoxBugs } from "./utils";
import Filter from "./filter";
import "./styles.scss";

console.info("*** Content script running ***");

compensateForFirefoxBugs();

new Filter({
  watchedFilterEnabled: true,
  membersOnlyFilterEnabled: false,
  showVideoNumbers: true,
});
