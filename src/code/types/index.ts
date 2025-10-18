export enum FilterNames {
  Watched = "watched",
  MembersOnly = "membersOnly",
}

export type Filters = Record<FilterNames, boolean>;

export enum ViewOptionNames {
  VideoNumbersAreShown = "videoNumbersAreShown",
}

export type ViewOptions = Record<ViewOptionNames, boolean>;

export type Options = ViewOptions;
