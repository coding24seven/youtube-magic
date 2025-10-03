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

const contents = "#contents";

const watchPageVideo = "yt-lockup-view-model";
const channelHomePageVideo = "ytd-grid-video-renderer";
const otherPagesVideo =
  "ytd-rich-item-renderer:not([is-post]):not([is-slim-media])";

const progressBarSegment = '*[class*="ProgressBarSegment" i][style*="width"]';
const progressId = '#progress[style*="width"]';

const membersOnlyBadge = "p.ytd-badge-supported-renderer";

const chipsContainer = "iron-selector#chips";

const numberedVideoClass = "numbered-video";
const videoNumberClass = "video-number";

export const selectors = {
  numberedVideoClass,
  videoNumberClass,
  contents,
  progressBar: [progressBarSegment, progressId].join(", "),
  membersOnlyBadge,
  chips: chipsContainer,
  video: {
    [HomePage]: otherPagesVideo,
    [SubscriptionsPage]: otherPagesVideo,
    [WatchPage]: watchPageVideo,
    [ChannelHomePage]: channelHomePageVideo,
    [ChannelFeaturedPage]: channelHomePageVideo,
    [ChannelVideosPage]: otherPagesVideo,
    [ChannelStreamsPage]: otherPagesVideo,
  },
};
