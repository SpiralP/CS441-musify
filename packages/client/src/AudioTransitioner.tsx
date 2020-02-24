import React from "react";

interface AudioTransitionerProps {
  urls: string[];

  render?: (url: string | null) => React.ReactNode;

  /**
   * defaults to true
   */
  crossfade: boolean;

  /**
   * defaults to false
   */
  autoPlay: boolean;

  /**
   * defaults to 2 seconds
   */
  crossfadeSeconds: number;
}

interface AudioTransitionerState {
  urlOne: string | null;
  urlTwo: string | null;
  whichIsPlaying: number;
}

export default class AudioTransitioner extends React.PureComponent<
  AudioTransitionerProps,
  AudioTransitionerState
> {
  static defaultProps = {
    crossfade: true,
    autoPlay: false,
    crossfadeSeconds: 2,
  };

  audioOneRef: React.RefObject<HTMLAudioElement> = React.createRef();
  audioTwoRef: React.RefObject<HTMLAudioElement> = React.createRef();

  urls: string[];
  constructor(props: AudioTransitionerProps) {
    super(props);

    this.urls = [...props.urls];

    this.state = {
      urlOne: this.urls.shift() || null,
      urlTwo: this.urls.shift() || null,
      whichIsPlaying: 1,
    };
  }

  crossfadeInterval?: NodeJS.Timer;

  componentDidMount() {
    const { autoPlay, crossfade } = this.props;

    const audioOne = this.audioOneRef.current;
    if (!audioOne) {
      throw new Error("audioOne ref invalid");
    }

    const audioTwo = this.audioTwoRef.current;
    if (!audioTwo) {
      throw new Error("audioTwo ref invalid");
    }

    if (autoPlay) {
      let canplay: () => void;
      canplay = () => {
        audioOne.play();
        audioOne.removeEventListener("canplay", canplay);
      };
      audioOne.addEventListener("canplay", canplay);
    }

    if (crossfade) {
      audioOne.addEventListener("canplay", () => {
        audioOne.volume = 0;
      });

      audioTwo.addEventListener("canplay", () => {
        audioTwo.volume = 0;
      });

      const checkCrossfade = (audio: HTMLAudioElement) => {
        if (audio.paused) {
          return;
        }

        const { currentTime, duration } = audio;
        if (isFinite(duration) && duration !== 0 && isFinite(currentTime)) {
          let crossfadeSeconds = this.props.crossfadeSeconds;

          if (duration <= crossfadeSeconds * 2) {
            crossfadeSeconds = duration * 0.2;
          }

          const remainingTime = duration - currentTime;

          if (currentTime < crossfadeSeconds) {
            const percent = currentTime / crossfadeSeconds;
            audio.volume = percent;
            // console.log("in", audio.volume);
          } else if (remainingTime < crossfadeSeconds) {
            const percent = remainingTime / crossfadeSeconds;
            audio.volume = percent;
            // console.log("out", audio.volume);
          } else {
            audio.volume = 1;
          }
        }
      };

      this.crossfadeInterval = setInterval(() => {
        checkCrossfade(audioOne);
        checkCrossfade(audioTwo);
      }, 100);
    }
  }

  componentWillUnmount() {
    if (this.crossfadeInterval) {
      clearInterval(this.crossfadeInterval);
      this.crossfadeInterval = undefined;
    }
  }

  render() {
    const { render } = this.props;
    const { urlOne, urlTwo, whichIsPlaying } = this.state;

    return (
      <>
        {render ? render(whichIsPlaying === 1 ? urlOne : urlTwo) : null}
        {urlOne ? (
          <audio
            key={1}
            controls
            ref={this.audioOneRef}
            preload="auto"
            src={urlOne}
            onEnded={() => {
              this.setState({
                urlOne: this.urls.shift() || null,
                whichIsPlaying: 2,
              });
              this.audioOneRef.current?.pause();
              this.audioTwoRef.current?.play();
            }}
            hidden={whichIsPlaying !== 1}
          />
        ) : null}

        {urlTwo ? (
          <audio
            key={2}
            controls
            ref={this.audioTwoRef}
            preload="auto"
            src={urlTwo}
            onEnded={() => {
              this.setState({
                urlTwo: this.urls.shift() || null,
                whichIsPlaying: 1,
              });
              this.audioTwoRef.current?.pause();
              this.audioOneRef.current?.play();
            }}
            hidden={whichIsPlaying !== 2}
          />
        ) : null}
      </>
    );
  }
}
