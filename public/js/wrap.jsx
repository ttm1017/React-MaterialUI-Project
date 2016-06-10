import React from 'react';
import Slider from './slider.jsx';
import $ from 'jquery';
import Content from './content.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
class Wrap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
            ifClear: false
        }
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(e) {
        const state = {};
        Object.assign(state, this.state, {
            ifClear: true,
            content: $(e.target).closest('span').get(0).className
        });
        this.setState(state);
    }
    render() {
        return (
          <div style={{ height: '100%' }}>
            <div style={{ height: '100%', display: 'inline-block', width: '15%' }}>
              <Slider onClick={this.handleOnClick} />
            </div>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Content name={this.state.content} ifClear={this.state.ifClear} />
            </MuiThemeProvider>
          </div>);
    }
}
export default Wrap;
