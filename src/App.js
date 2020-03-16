import React from 'react';
import { TSMind } from 'ts-mind';
import 'ts-mind/style/index.css';
import './App.css';
import Audio from './elements/audio';
const style = {
  timer: {position: 'absolute', right: 0, bottom: 0},
  null: {},
  none: { display: 'none'}
};
const SOUND_URL = 'https://api.coderrocketfuel.com/assets/pomodoro-times-up.mp3';

const tsm = new TSMind({
  container: "#container" // or Node
})

class Apps extends React.Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.state = {
      timer: 0,
      timer_tick_value: 0,
      timer_value: Infinity,
      isTimerRunning: true,
      isTimerStopped: false,
      isChecked: {
        one_min: false,
        two_min: false,
        three_min: false,
        input_min: false,
        unlimited_min: false,
      }
    };

    // sound
    this.soundSource = null;
    this.soundBuffer = null;

    this.onRadioHandler = this.onRadioHandler.bind(this);
    this.onInputHandler = this.onInputHandler.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.unpauseTimer = this.unpauseTimer.bind(this);
  }

  play(){
    this.audioRef.current.play();
  }

  stop(){
    this.audioRef.current.stop();
  }

  stopTimer(){
    this.setState({isTimerRunning: false, timer_tick_value: 0, timer: 0});
    clearInterval(this.timer);
  }

  runTimerIterator(){
    const timer = this.timer = setInterval(() => {

      if(this.state.timer_value <= this.state.timer){
        this.play(); // run audio
        clearInterval(this.timer);
      }else{
        this.setState({ timer: this.state.timer + this.state.timer_tick_value });
      }
    }, 1000);

    return timer;
  }

  startTimer(){
    this.play(); // run audio
    this.setState({
      isTimerRunning: true,
      timer_tick_value: 1000
    }, () => {
      this.timer = this.runTimerIterator();
    });

  }

  pauseTimer(){
    this.setState({isTimerRunning: false, isTimerStopped: true, timer_tick_value: 0});
  }

  unpauseTimer(){
    this.setState({isTimerRunning: true, isTimerStopped: false, timer_tick_value: 1000});
  }

  renderTime = (time) => {
    const currentTime = new Date(+time);

    let diem = 'AM';
    let h = currentTime.getHours();
    let m = currentTime.getMinutes();
    let s = currentTime.getSeconds();
    let ms = currentTime.getMilliseconds();

    if (m < 10) {
      m = `0${m}`;
    }
    if (s < 10) {
      s = `0${s}`;
    }

    ms = `${Math.floor(ms/100)}`;

    const output = {
      hours: h - 3,
      minutes: m,
      seconds: s,
      milliseconds: ms,
      diem
    };

    return `0${output.hours}:${output.minutes}:${output.seconds}`;
  };

  onRadioHandler(type, e){
    const k = Object.assign({}, this.state.isChecked);

    for(let m in k){
      typeof m === 'string'&& k.hasOwnProperty(m) && m === type ? k[m] = true : k[m] = false;
    }

    this.setState({isChecked: k, timer_value: +e.target.value*1000});
  }

  onInputHandler(type, e){
    this.setState({timer_value: +e.target.value*1000})
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (<div className="timer" style={style.timer}>
      <div className="timer-tablo" style={{fontSize: 62}}>
        {this.renderTime(this.state.timer)}
      </div>
      <div className="timer-controls timer-controls_radio">
        <label htmlFor="">
          <input
            type="radio"
            className="timer-controls__radio"
            name="min"
            value="60"
            checked={this.state.one_min}
            onChange={this.onRadioHandler.bind(null, 'one_min')}
          />
          <span>1 min</span>
        </label>
        <label htmlFor="">
          <input
            type="radio"
            className="timer-controls__radio"
            name="min"
            checked={this.state.two_min}
            value="120"
            onChange={this.onRadioHandler.bind(null, 'two_min')}
          />
          <span>2 min</span>
        </label>
        <label htmlFor="">
          <input
            type="radio"
            className="timer-controls__radio"
            name="min"
            checked={this.state.three_min}
            value="180"
            onChange={this.onRadioHandler.bind(null, 'tree_min')}
          />
          <span>3 min</span>
        </label>
        <label htmlFor="">
          <input
            type="radio"
            className="timer-controls__radio"
            name="min"
            checked={this.state.unlimited_min}
            value="Infinity"
            onChange={this.onRadioHandler.bind(null, 'unlimited_min')}
          />
          <span>unlimited</span>
        </label>
        <label htmlFor="">
          <input
            type="radio"
            className="timer-controls__radio"
            name="min"
            checked={this.state.input_min}
            value="0"
            onChange={this.onRadioHandler.bind(null, 'input_min')}
          />
          <input style={!this.state.isChecked.input_min ? style.none : style.null} type="text" className="timer-controls__input" onInput={this.onInputHandler.bind(null, 'input_min')}/>
        </label>
      </div>
      <div className="timer-controls timer-controls_buttons">
        <button
          type="button"
          className='button button_play'
          onClick={this.startTimer}
        >{'play'}</button>
        <button
          type="button"
          className='button button_pause'
          onClick={this.state.isTimerStopped ? this.unpauseTimer : this.pauseTimer}
        >{this.state.isTimerStopped ? 'unpause' : 'pause'}</button>
        <button
          type="button"
          className='button button_stop'
          onClick={this.stopTimer}
        >{'stop'}</button>
      </div>
      <Audio ref={this.audioRef}/>
      <div id="#container"/> 
    </div>);
  }
}

export default Apps;
