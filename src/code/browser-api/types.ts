import Tab = browser.tabs.Tab;
import { BrowserEvents } from "../content/events";
import { Filters, Options } from "../types";

export interface State {
  extensionIsEnabled: boolean | undefined;
  filters: Filters;
  options: Options;
  videoCount: number | undefined;
  hiddenVideoCount: number | undefined;
}

export type StateChanges = {
  [K in keyof State]?: { newValue: NonNullable<State[K]> };
};

export interface MessageToContentPayload {
  browserEvent: BrowserEvents;
  tabId: number | undefined;
}

export interface UpdateIconProperties {
  extensionIsEnabled: boolean;
}

export interface UpdateProperties {
  browserEvent: BrowserEvents;
  activeTab?: Tab;
}
