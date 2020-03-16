import React, { Component } from 'react';
import msg from '../assets/sounds/short_msg.mp3';

const TAPE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/858/outfoxing.mp3';
const style = {
  audio: { display: 'none' },
};


class Audio extends Component {
  constructor(props) {
    super(props);
    this.audioElm = React.createRef();
    this.state = {
      pan: 0,
      volume: 1
    }
  }

  componentDidMount() {
    // create audio context
    this.createAudioContext();

    // // if track ends
    // this.audioElm.addEventListener('ended', () => {
    //   console.log('listener added');
    // }, false);
  }

  componentWillUnmount() {
    // this.audioElm.removeEventListener('ended');
  }

  createAudioContext(){
    // for cross browser
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.track = this.audioCtx.createMediaElementSource(this.audioElm.current);

    // volume
    this.gainNode = this.audioCtx.createGain();

    // panning
    const pannerOptions = {pan: 0};
    this.panner = new StereoPannerNode(this.audioCtx, pannerOptions);

    // connect our graph
    this.track
      .connect(this.gainNode)
      .connect(this.panner)
      .connect(this.audioCtx.destination);
  }

  onVolumeHandler(e){
    this.gainNode.gain.value = e.target.value;
    this.setState({volume: e.target.value});
  }

  onPanHandler(e){
    this.panner.pan.value = e.target.value;
    this.setState({pan: e.target.value});
  }

  play() {
    // check if context is in suspended state (autoplay policy)
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.audioElm.current.play();
  }

  stop() {
    // stop the source now
    this.audioElm.current.pause();
  }


  render() {
    return (
      <div id="audio-player">
        <div className="audio-player__body">
          <section className="master-controls">
            <input
              onChange={this.onVolumeHandler.bind(this)}
              type="range"
              className="control-volume"
              min="0"
              max="2"
              value={this.state.volume}
              list="gain-vals"
              step="0.01"
              data-action="volume"
            />
            <datalist id="gain-vals">
              <option value="0" label="min" />
              <option value="2" label="max" />
            </datalist>
            <label htmlFor="volume">VOL</label>
            <input
              onChange={this.onPanHandler.bind(this)}
              type="range"
              id="panner"
              className="control-panner"
              list="pan-vals"
              min="-1"
              max="1"
              value={this.state.pan}
              step="0.01"
              data-action="panner"
            />
            <datalist id="pan-vals">
              <option value="-1" label="left"/>
              <option value="1" label="right"/>
            </datalist>
            <label htmlFor="panner">PAN</label>
            <button
              className="tape-controls-pause"
              role="switch"
              aria-checked="false"
              onClick={this.stop.bind(this)}
            ><span>Pause</span></button>
            <button
              className="tape-controls-play"
              role="switch"
              aria-checked="false"
              onClick={this.play.bind(this)}
            ><span>Play</span></button>
          </section>

          <section className="tape" style={style.audio}>
            <audio ref={this.audioElm} src={msg} crossOrigin="anonymous" />
          </section>
        </div>
      </div>
    )
  }
}


export default Audio;
