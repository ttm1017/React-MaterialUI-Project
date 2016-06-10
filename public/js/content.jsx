import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import qrcode from 'jquery.qrcode';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
let ifQueryData = 0;
let itemNumber = [];
class ReferTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <div>
              <Table>
            <TableHeader>
                <TableRow>
                    <TableHeaderColumn tooltip="Id">Id</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Number">快递单号</TableHeaderColumn>
                    <TableHeaderColumn tooltip="StorePlace">仓库内位置</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Type">单品种类</TableHeaderColumn>
                    <TableHeaderColumn tooltip="incomeTime">入库时间</TableHeaderColumn>
                    <TableHeaderColumn tooltip="deadTime">到期时间</TableHeaderColumn>
                    <TableHeaderColumn tooltip="reasonOfIn">入库原因</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody>
                {this.props.tableData.map((row, index) => (
                  <TableRow key={index} >
                      <TableRowColumn>{index}</TableRowColumn>
                      <TableRowColumn>{row.Number}</TableRowColumn>
                      <TableRowColumn>{row.savePlace}</TableRowColumn>
                      <TableRowColumn>{row.type}</TableRowColumn>
                      <TableRowColumn>{row.inToTime.match(/(\w+-\w+-\w+)T/)[1]}</TableRowColumn>
                      <TableRowColumn>{row.deadTime.match(/(\w+-\w+-\w+)T/)[1]}</TableRowColumn>
                      <TableRowColumn>{row.inToReason}</TableRowColumn>
                  </TableRow>
                ))}
            </TableBody>
        </Table>
          </div>);
    }
}
class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 1, countDeliveryNumber: [], tableData: [] };
        this.handleChange = this.handleChange.bind(this);
        this.recordQuery = this.recordQuery.bind(this);
        this.SimpleQueryType = this.SimpleQueryType.bind(this);
        this.SimpleQueryDate = this.SimpleQueryDate.bind(this);
        this.handleOnBlurRecord = this.handleOnBlurRecord.bind(this);
        this.handChangeCountNumber = this.handChangeCountNumber.bind(this);
        this.handleSelectOutWarehouse = this.handleSelectOutWarehouse.bind(this);
        this.passInputValue = this.passInputValue.bind(this);
        this.queryOutWarehouse = this.queryOutWarehouse.bind(this);
        this.handleOutWarehouse = this.handleOutWarehouse.bind(this);
    }
    componentDidUpdate() {
      ifQueryData = 0;
    }
    handleChange(event, index, value) { this.setState({ value }); }
    handleOnBlurRecord() {
        const queryCondition = this.refs.condition.getValue();
        const stateObj = Object.assign({}, this.state, { condition: queryCondition });
        this.setState(stateObj);
    }
    handChangeCountNumber(nothing, date) {
        this.setState({ value: date });
    }
    handleSelectOutWarehouse(selectRow) {
        for (const item of selectRow) {
            itemNumber.push(this.state.tableData[item].Number);//store data in itemNumber
        }
    }
    passInputValue() {
        const self = this;
        const value = {
            Number: this.refs.expressNumber.getValue(),
            type: this.refs.expressType.getValue(),
            savePlace: this.refs.storePlace.getValue(),
            inToReason: this.refs.reasonOfIn.getValue()
        };
        $('.qrcode').qrcode({ text: JSON.stringify(value), width: 144, height: 144 });
        $.get('/inputRecord', value, function () {
            const state = Object.assign({}, this.state, { input: "" } );
            this.setState(state);
        }.bind(self));
    }
    SimpleQueryType() {
        const self = this;
        $.get('/SimpleQueryType', this.state, function (data) {
            ifQueryData = 1;
            const state = Object.assign({}, this.state, { queryData: data });
            this.setState(state);
        }.bind(self));
    }
    SimpleQueryDate() {
      const self = this;
      $.get('/SimpleQueryDate', this.state, function (data) {
        //countDeliveryNumber is a Array,and the row of countDeliveryNumber is
        //Object that contain Number
        console.log(data);
        const state = Object.assign({}, this.state, { countDeliveryNumber: data });
        this.setState(state);
      }.bind(self));
    }
    recordQuery() {
        /*type 取值：1为按编号查询,2为按日期查询*/
        const self = this;
        $.get('/queryComplexData', this.state, function (data) {
            ifQueryData = 1;
          console.log(data);
            const state = Object.assign({}, this.state, {queryData: data});
            this.setState(state);
        }.bind(self));
    }
    handleOutWarehouse() {
        const self = this;
        const set = new Set(itemNumber);
        itemNumber = [...set];
        $.get('/OutWarehouse', { itemNumber }, function (data) {
            const state = Object.assign({}, this.state, { tableData: data });
            this.setState(state);//data should like tableData in the top
        }.bind(self));
        console.log(itemNumber);
    }
    queryOutWarehouse() {
        const self = this;
        $.get('/queryOutWarehouse', function (data) {
            console.log(data);
            const state = Object.assign({}, this.state, { tableData: data });
            this.setState(state);//data should like tableData in the top
        }.bind(self));
    }
    render() {
        const name = this.props.name;
        console.log(name);
        let element;
        if (name === 'input') {
            element = (<div className="inputContent">
                <TextField
                  floatingLabelText="快递单号"
                  style={{ width: '339px' }}
                  ref="expressNumber"
                  value={this.state.input}
                /><br />
                <br />
                <TextField
                  floatingLabelText="单品种类"
                  style={{ width: '339px' }}
                  ref="expressType"
                  value={this.state.input}
                /><br />
                <br />
                <TextField
                  floatingLabelText="仓库内位置"
                  style={{ width: '339px' }}
                  ref="storePlace"
                  value={this.state.input}
                /><br />
                <br />
                <TextField
                  floatingLabelText="入库原因"
                  style={{ width: '339px' }}
                  ref="reasonOfIn"
                  value={this.state.input}
                /><br />
                <br />
                <RaisedButton
                  label="入库" className="intoWarehouse" primary={true} style={{ margin: 12 }} onClick={this.passInputValue}//onclick function consider as one type
                />
              <div className="qrcode"></div>
            </div>);
        }
        else if (name === null) {
            element = <div></div>;
        }
        else if (name === 'manageType') {
            const tableComp = ifQueryData ? <ReferTable tableData={this.state.queryData} /> : null;
            element = (<div className="manageTypeContent">
              <SelectField value={this.state.value} onChange={this.handleChange}>
                <MenuItem value={1} primaryText="易碎" />
                <MenuItem value={2} primaryText="易燃" />
                <MenuItem value={3} primaryText="其他" />
              </SelectField>
              <RaisedButton
                label="查询" primary={true} style={{ margin: 12 }} onClick={this.SimpleQueryType}//onclick function consider as one type
              />
              {tableComp}
            </div>);
        }
        else if (name === 'recordQuery') {
            const tableComp = ifQueryData ? <ReferTable tableData={this.state.queryData} /> : null;
            element = (
              <div className="recordQueryContent">
                <SelectField value={this.state.value} onChange={this.handleChange}>
                  <MenuItem value={1} primaryText="按编号查询" />
                  <MenuItem value={2} primaryText="按日期查询" />
                </SelectField>
                <TextField
                  hintText="查询条件"
                  ref="condition"
                  onBlur={this.handleOnBlurRecord}
                />
                <RaisedButton
                  label="查询" primary={true} style={{ margin: 12 }} onClick={this.recordQuery}
                />
                  {tableComp}
              </div>
            );
        }
        else if (name === 'countNumber') {
            element = (<div className="countNumberContent">
                <DatePicker hintText="按日期查询入库件" ref="date" onChange={this.handChangeCountNumber} />
                <RaisedButton
                  label="查询" primary={true} style={{ margin: 12 }} onClick={this.SimpleQueryDate}
                />
                <Table >
                  <TableHeader>
                    <TableRow>
                      <TableHeaderColumn tooltip="Id">Id</TableHeaderColumn>
                      <TableHeaderColumn tooltip="recordNumber">入库件数</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {this.state.countDeliveryNumber.map((row, index) => (
                      <TableRow key={index}>
                        <TableRowColumn>{index}</TableRowColumn>
                        <TableRowColumn>{row.Number}</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>);
        }
        else {
            element = (<div className="outWarehouseContent">
              <Table multiSelectable={true} onRowSelection={this.handleSelectOutWarehouse}>
                <TableHeader enableSelectAll={true}>
                  <TableRow>
                    <TableHeaderColumn tooltip="Id">Id</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Number">快递单号</TableHeaderColumn>
                    <TableHeaderColumn tooltip="StorePlace">仓库内位置</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Type">单品种类</TableHeaderColumn>
                    <TableHeaderColumn tooltip="DeadTime">到期时间</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {this.state.tableData.map((row, index) => (
                      <TableRow key={index} >
                        <TableRowColumn>{index}</TableRowColumn>
                        <TableRowColumn>{row.Number}</TableRowColumn>
                        <TableRowColumn>{row.savePlace}</TableRowColumn>
                        <TableRowColumn>{row.type}</TableRowColumn>
                        <TableRowColumn>{row.deadTime}</TableRowColumn>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <RaisedButton
                label="查询" primary={true} style={{ margin: 12 }} onClick={this.queryOutWarehouse}
              />
              <RaisedButton
                label="出库" primary={true} style={{ margin: 12 }} onClick={this.handleOutWarehouse}
              />
            </div>);
        }
        return (element);
    }
}
export default Content;
