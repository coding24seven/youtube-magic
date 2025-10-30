import { YouTubePageTypes } from '../content/types';

interface Page {
  lastUrl: string;
  type: YouTubePageTypes | undefined;
}

const {
  HomePage,
  ChannelFeaturedPage,
  ChannelHomePage,
  WatchPage,
  SubscriptionsPage,
  ChannelVideosPage,
  ChannelStreamsPage,
} = YouTubePageTypes;



export default class YouTube {
  private static pageTypesRegex: Record<YouTubePageTypes, RegExp[]> = {
    [HomePage]: [/youtube\.com\/?$/],
    [SubscriptionsPage]: [/youtube\.com\/feed\/subscriptions\/?$/],
    [WatchPage]: [/youtube\.com\/watch/],
    [ChannelHomePage]: [
      /youtube\.com\/@[^/]+$/ /* youtube.com/@channelname */,
      /youtube\.com\/c\/[^/]+$/ /* youtube.com/c/channelname */,
    ],
    [ChannelFeaturedPage]: [
      /youtube\.com\/@.+\/featured/ /* youtube.com/@channelname/featured */,
      /youtube\.com\/c\/[^/]+\/featured/ /* youtube.com/c/channelname/featured */,
    ],
    [ChannelVideosPage]: [
      /youtube\.com\/@.+\/videos/ /* youtube.com/@channelname/videos */,
      /youtube\.com\/c\/[^/]+\/videos/ /* youtube.com/c/channelname/videos */,
    ],
    [ChannelStreamsPage]: [
      /youtube\.com\/@.+\/streams/ /* youtube.com/@channelname/streams */,
      /youtube\.com\/c\/[^/]+\/streams/ /* youtube.com/c/channelname/streams */,
    ],
  };

  private page: Page = {
    lastUrl: '',
    type: undefined,
  };

  public getActionablePageType(url: string) {
    if (!url) {
      throw new Error(
        `Can't get current youtube page type while url is: ${url}`,
      );
    }

    if (url === this.page.lastUrl) {
      return this.page.type;
    }

    const entry = Object.entries(YouTube.pageTypesRegex).find(
      ([_pageType, regularExpressions]) =>
        regularExpressions.some((regExp) => regExp.test(url)),
    ) as [YouTubePageTypes, RegExp[]] | undefined;

    if (!entry) {
      return;
    }

    const [pageType] = entry;

    this.page.lastUrl = url;
    this.page.type = pageType;

    return pageType;
  }
}
