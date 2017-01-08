import React, {Component} from 'react';

//import material-ui
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
export default class TTable extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {tableData} = this.props;
        return (
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn tooltip="Id">Id</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Number">学号</TableHeaderColumn>
                            <TableHeaderColumn tooltip="StorePlace">课程Id</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Type">考勤成绩</TableHeaderColumn>
                            <TableHeaderColumn tooltip="incomeTime">实验成绩</TableHeaderColumn>
                            <TableHeaderColumn tooltip="deadTime">总成绩</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((row, index) => (
                            <TableRow key={index} >
                                <TableRowColumn>{index}</TableRowColumn>
                                <TableRowColumn>{row.studentId}</TableRowColumn>
                                <TableRowColumn>{row.courseId}</TableRowColumn>
                                <TableRowColumn>{row.work_score}</TableRowColumn>
                                <TableRowColumn>{row.attendance_score}</TableRowColumn>
                                <TableRowColumn>{row.grade}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>);
    }
}