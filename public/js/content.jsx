import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import TTable from './table.jsx';
let ifQueryData = 0;
let requestDone;
let itemNumber = [];
class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 1, tableData: [], input: ""};
        requestDone = true;
        this.passInputValue = this.passInputValue.bind(this);
        this.selectChange = this.selectChange.bind(this);
        this.SimpleQueryType = this.SimpleQueryType.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }
    componentDidUpdate() {
      ifQueryData = 0;
    }
    passInputValue() {
        const self = this;
        requestDone = false;
        console.log(this.refs);
        const value = {
            studentId: this.refs.studentId.getValue(),
            courseId: this.refs.courseId.getValue(),
            work_score: this.refs.work_score.getValue(),
            attendance_score: this.refs.attendance_score.getValue()
        };
        $.get('/insert', value, function () {
            const state = Object.assign({}, this.state, { input: "" } );
            requestDone = true;
            this.setState(state);
            Object.keys(this.refs).forEach(function (value) {
                self.refs[value].input.value = ""
            });
        }.bind(self));
    }
    selectChange(event, index, value) { this.setState({ value }); }
    SimpleQueryType() {
        const self = this;
        const queryCondition = this.refs.queryCondition.getValue();
        const queryObj = Object.assign({},this.state,{type: 'query',queryCondition});
        $.get('/query', queryObj, function (data) {
            ifQueryData = 1;
            const state = Object.assign({}, this.state, { queryData: data,input: "" });
            Object.keys(this.refs).forEach(function (value) {
                self.refs[value].input.value = ""
            });
            this.setState(state);
        }.bind(self));
    }
    deleteRecord() {
        const self = this;
        const deleteStudentId = this.refs.deleteStudentId.getValue();
        const deleteCourseId = this.refs.deleteCourseId.getValue();
        const deleteCondition = {
            type: 'delete',
            deleteStudentId,
            deleteCourseId
        };
        $.get('/delete', deleteCondition, function (data) {
            Object.keys(this.refs).forEach(function (value) {
                self.refs[value].input.value = ""
            });
            alert(data);
        }.bind(self));
    }
    render() {
        const name = this.props.name;
        let element;
        if (name === 'insert') {
            element = (<div className="inputContent">
                <TextField
                  floatingLabelText="学号"
                  style={{ width: '339px' }}
                  ref="studentId"
                /><br />
                <br />
                <TextField
                  floatingLabelText="课程Id"
                  style={{ width: '339px' }}
                  ref="courseId"
                /><br />
                <br />
                <TextField
                  floatingLabelText="考勤成绩"
                  style={{ width: '339px' }}
                  ref="work_score"
                /><br />
                <br />
                <TextField
                  floatingLabelText="实验成绩"
                  style={{ width: '339px' }}
                  ref="attendance_score"
                /><br />
                <br />
                <TextField
                    floatingLabelText="总成绩"
                    style={{ width: '339px' }}
                    ref="grade"
                />
                <RaisedButton
                  label="插入" className="intoWarehouse" primary={true} style={{ margin: 12 }} onClick={this.passInputValue}//onclick function consider as one type
                />
            </div>);
        }
        else if (name === 'query') {
            const tableComp = ifQueryData ? <TTable tableData={this.state.queryData} /> : null;
            element = (<div className="manageTypeContent">
              <SelectField value={this.state.value} onChange={this.selectChange}>
                <MenuItem value={1} primaryText="按学号查询" />
                <MenuItem value={2} primaryText="按课程查询" />
              </SelectField>
                <TextField
                    floatingLabelText="查询条件"
                    style={{ width: '339px' }}
                    ref="queryCondition"
                />
              <RaisedButton
                label="查询" primary={true} style={{ margin: 12 }} onClick={this.SimpleQueryType}//onclick function consider as one type
              />
              {tableComp}
            </div>);
        }
        else if (name === 'delete') {

            element = (
              <div className="recordQueryContent">
                <TextField
                  hintText="学生学号"
                  ref="deleteStudentId"
                />
                  <TextField
                      hintText="课程Id"
                      ref="deleteCourseId"
                  />
                <RaisedButton
                  label="删除" primary={true} style={{ margin: 12 }} onClick={this.deleteRecord}
                />
              </div>
            );
        }
        else if (name === null) {
            element = <div></div>;
        }
        return (element);
    }
}
export default Content;
