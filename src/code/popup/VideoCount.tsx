interface Props {
  videoCount: number;
  hiddenVideoCount: number;
}

export const VideoCount = ({ videoCount, hiddenVideoCount }: Props) => {
  const shownVideoCount = videoCount - hiddenVideoCount;

  return (
    <section>
      <h4 className="youtube-magic-popup__video-count-heading">Video Count:</h4>
      <p className="youtube-magic-popup__video-count">
        {`Total:    ${videoCount}`}
      </p>
      <p className="youtube-magic-popup__video-count">
        Shown: {shownVideoCount}
      </p>
      <p className="youtube-magic-popup__video-count">
        Hidden: {hiddenVideoCount}
      </p>
    </section>
  );
};
