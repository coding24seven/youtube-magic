interface Props {
  videoCount: number;
  hiddenVideoCount: number;
}

export const VideoCount = ({ videoCount, hiddenVideoCount }: Props) => {
  return (
    <section>
      <h4 className="youtube-magic-popup__video-count-heading">Video Count:</h4>
      <p className="youtube-magic-popup__video-count">
        {`Total:    ${videoCount}`}
      </p>
      <p className="youtube-magic-popup__hidden-video-count">
        Hidden: {hiddenVideoCount}
      </p>
    </section>
  );
};
