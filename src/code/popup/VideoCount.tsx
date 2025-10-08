interface Props {
  videoCount: number;
  hiddenVideoCount: number;
}

export const VideoCount = ({ videoCount, hiddenVideoCount }: Props) => {
  return (
    <>
      <p id="video-count">Videos Total: {videoCount}</p>
      <p id="hidden-video-count">Videos Hidden: {hiddenVideoCount}</p>
    </>
  );
};
