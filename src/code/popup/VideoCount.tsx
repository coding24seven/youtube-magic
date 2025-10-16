interface Props {
  videoCount: number;
  hiddenVideoCount: number;
}

export const VideoCount = ({ videoCount, hiddenVideoCount }: Props) => {
  const shownVideoCount = videoCount - hiddenVideoCount;

  return (
    <section>
      <h4 className="youtube-magic-popup__video-count-heading">Video Count:</h4>
      <ul className="youtube-magic-popup__video-count-list">
        <li className="youtube-magic-popup__video-count-item">
          {`Total:    ${videoCount}`}
        </li>
        <li className="youtube-magic-popup__video-count-item">
          Shown: {shownVideoCount}
        </li>
        <li className="youtube-magic-popup__video-count-item">
          Hidden: {hiddenVideoCount}
        </li>
      </ul>
    </section>
  );
};
