import { h, Component, render } from 'preact';
import style from './style';
import content from './content'
import Markdown from 'preact-markdown';

export default class About extends Component {
  render(props,state){
    return(
      <div class={"container "+style.about}>
        <Markdown markdown={content} />
      </div>
    )
  }
}
