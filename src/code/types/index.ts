export enum FilterNames {
  Watched = "watched",
  MembersOnly = "membersOnly",
}

export type Filters = Partial<Record<FilterNames, boolean>>;

export enum ViewOptionNames {
  VideoNumbersAreShown = "videoNumbersAreShown",
}

export type ViewOptions = Record<ViewOptionNames, boolean>;

export type Options = ViewOptions;
