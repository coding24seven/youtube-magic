interface Props {
  videoCount: number;
  hiddenVideoCount: number;
}

export const VideoCount = ({ videoCount, hiddenVideoCount }: Props) => {
  return (
    <section>
      <h4 className="youtube-magic-popup__video-count-heading">Count:</h4>
      <p className="youtube-magic-popup__video-count">
        Videos Total: {videoCount}
      </p>
      <p className="youtube-magic-popup__hidden-video-count">
        Videos Hidden: {hiddenVideoCount}
      </p>
    </section>
  );
};
