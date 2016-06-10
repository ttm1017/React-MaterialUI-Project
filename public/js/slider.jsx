/**
 * Created by ttm on 2016/6/6.
 */
// import React from 'react';
// const list = ['登记单号']

import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const muiTheme = getMuiTheme({
    spacing: '200px',
});
const ListStyle = {
    height: '100%',
    borderRight: '1px solid rgb(217, 217, 217)'
}
class Slider extends React.Component {
    render() {
        return (<MuiThemeProvider muiTheme={muiTheme}>
          <List  onClick={this.props.onClick} style={ListStyle} >
            <ListItem primaryText="入库单据填写" className="input" />
            <ListItem primaryText="管理单品种类" className="manageType" />
            <Divider />
            <ListItem primaryText="出入库记录查询" className="recordQuery" />
            <ListItem primaryText="单品数量查询" className="countNumber" />
            <Divider />
            <ListItem primaryText="单品出库" className="outWarehouse" />
          </List>
        </MuiThemeProvider>)
    }
};

export default Slider;