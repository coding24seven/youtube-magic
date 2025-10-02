import { YouTubePageTypes } from "./types";

const {
  HomePage,
  SubscriptionsPage,
  WatchPage,
  ChannelHomePage,
  ChannelFeaturedPage,
  ChannelVideosPage,
  ChannelStreamsPage,
} = YouTubePageTypes;

const contentsSelector = "#contents";

const watchPageVideoSelector = "yt-lockup-view-model";
const channelHomePageVideoSelector = "ytd-grid-video-renderer";
const otherPagesVideoSelector =
  "ytd-rich-item-renderer:not([is-post]):not([is-slim-media])";

const progressBarSegmentSelector =
  '*[class*="ProgressBarSegment" i][style*="width"]';
const progressIdSelector = '#progress[style*="width"]';

const membersOnlyBadgeSelector = "p.ytd-badge-supported-renderer";

const chipsContainerSelector = "iron-selector#chips";

export const selectors = {
  numberedVideoClass: "numbered-video",
  videoNumberClass: "video-number",
  contents: {
    [HomePage]: contentsSelector,
    [SubscriptionsPage]: contentsSelector,
    [WatchPage]: contentsSelector,
    [ChannelHomePage]: contentsSelector,
    [ChannelFeaturedPage]: contentsSelector,
    [ChannelVideosPage]: contentsSelector,
    [ChannelStreamsPage]: contentsSelector,
  },
  chips: {
    [WatchPage]: chipsContainerSelector,
    [HomePage]: chipsContainerSelector,
    [SubscriptionsPage]: chipsContainerSelector,
    [ChannelHomePage]: chipsContainerSelector,
    [ChannelFeaturedPage]: chipsContainerSelector,
    [ChannelVideosPage]: chipsContainerSelector,
    [ChannelStreamsPage]: chipsContainerSelector,
  },
  video: {
    [HomePage]: otherPagesVideoSelector,
    [SubscriptionsPage]: otherPagesVideoSelector,
    [WatchPage]: watchPageVideoSelector,
    [ChannelHomePage]: channelHomePageVideoSelector,
    [ChannelFeaturedPage]: channelHomePageVideoSelector,
    [ChannelVideosPage]: otherPagesVideoSelector,
    [ChannelStreamsPage]: otherPagesVideoSelector,
  },
  progressBar: {
    [HomePage]: progressBarSegmentSelector,
    [SubscriptionsPage]: progressBarSegmentSelector,
    [WatchPage]: progressBarSegmentSelector,
    [ChannelHomePage]: progressIdSelector,
    [ChannelFeaturedPage]: progressIdSelector,
    [ChannelVideosPage]: progressIdSelector,
    [ChannelStreamsPage]: progressIdSelector,
  },
  membersOnlyBadge: {
    [HomePage]: membersOnlyBadgeSelector,
    [SubscriptionsPage]: membersOnlyBadgeSelector,
    [WatchPage]: membersOnlyBadgeSelector,
    [ChannelHomePage]: membersOnlyBadgeSelector,
    [ChannelFeaturedPage]: membersOnlyBadgeSelector,
    [ChannelVideosPage]: membersOnlyBadgeSelector,
    [ChannelStreamsPage]: membersOnlyBadgeSelector,
  },
};
