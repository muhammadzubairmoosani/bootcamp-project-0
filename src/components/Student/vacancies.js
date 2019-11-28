import React from 'react';
import { Accordion, Card, Button, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import Middleware from '../../store/middleware';
let keys;
let userKey;
class Vacancies extends React.Component {
    componentDidMount() {
        this.props.viewVacanciesDispatch()
    }
    componentDidUpdate(prevProps) {
        const { user } = this.props;
        if (prevProps.user !== user) {
            userKey = user[1][0];
        }
    }

    _apply = (companyIndex, jobIndex) => {
        let companykey = keys[companyIndex];
        this.props.jobApplyDispatch(companykey, companyIndex, userKey, jobIndex)
    }
    render() {
        const { companies, user,students } = this.props;
        let vacancies = Object.values(companies);
        keys = Object.keys(companies);
        console.log(students)
        return (
            <Accordion>
                {!!user.length && !!vacancies.length && vacancies.map((item, index) => {
                    return <Card>
                        <Card.Header>
                            <Table striped bordered>
                                <thead>
                                    <tr>
                                        <th>Company Name</th>
                                        <th>HR Name</th>
                                        <th>Email</th>
                                        <th>Contact</th>
                                        <th>Adress</th>
                                        <th>About Us</th>
                                        <th>View Vacancies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{item.companyName}</td>
                                        <td>{item.HRname}</td>
                                        <td>{item.email}</td>
                                        <td>{item.mobile}</td>
                                        <td>{item.address}</td>
                                        <td>{item.description}</td>
                                        <td className='p-0 text-center'>
                                            <Accordion.Toggle
                                                disabled={item.posts ? '' : 'disabled'}
                                                as={Button}
                                                variant="link"
                                                eventKey={index}
                                            >
                                                <Button variant='success'>View</Button>
                                            </Accordion.Toggle>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Header>
                        <Card.Body>
                            {item.posts && item.posts.map((i, indx) => {
                                let isExist = null;
                                for (let key in i.appliedStudents) {
                                    if (user.length > 0 && i.appliedStudents[key] === user[1][0]) {
                                        isExist = i.appliedStudents[key]
                                    }
                                }
                                return <Accordion.Collapse eventKey={index}>
                                    <Table striped bordered>
                                        <thead>
                                            <tr>
                                                <th>Job Title</th>
                                                <th>Job Descripion</th>
                                                <th>Salary</th>
                                                <th>Apply</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{i.jobTitle}</td>
                                                <td>{i.description}</td>
                                                <td>{i.salary}</td>
                                                <td className='text-right'>
                                                    <Button
                                                        onClick={() => this._apply(index, indx)}
                                                        disabled={isExist}
                                                    >
                                                        {isExist ? 'Applied' : 'Apply'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Accordion.Collapse>
                            })}
                        </Card.Body>
                    </Card>
                })}
            </Accordion>
        );
    }
}

function mapStateToProps(state) {
    return {
        companies: state.reducer.vacancies,
        user: state.reducer.user,
        students: state.reducer.students
    }
}
function mapDispatchToProps(dispatch) {
    return {
        viewVacanciesDispatch: () => dispatch(Middleware.getVacancies()),
        jobApplyDispatch: (...data) => dispatch(Middleware.jobApply(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Vacancies);