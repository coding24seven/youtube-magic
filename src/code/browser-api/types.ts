import Tab = browser.tabs.Tab;
import { YouTubePageTypes } from "../content/types";
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

export interface MessagePayload {
  browserEvent: BrowserEvents;
  tabId: number | undefined;
  extensionIsEnabled: boolean;
  currentYouTubePageType: YouTubePageTypes | undefined;
}

export interface UpdateIconProperties {
  extensionIsEnabled?: boolean;
  tabUrl?: string;
}

export interface UpdateStateProperties {
  browserEvent: BrowserEvents;
  extensionIsEnabled?: boolean;
  activeTab?: Tab;
}
