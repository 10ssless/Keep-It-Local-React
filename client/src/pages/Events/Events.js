import React from "react";
import { Link } from "react-router-dom";
import Bubble from "./../../components/Bubble/Bubble";
import Focus from './../Focus/Focus'
import './Events.css';
import Moment from "react-moment"
import 'moment-timezone';

class Events extends React.Component {

    state = {
        data: null,
        fetching: false,
        focusing: null
    }

    getEvents = (cb) => {
        console.log('getting events');
        const url = "/api/events";
        this.setState({ fetching: true }); //can be used to display some loading animation or something because the loading process can take a little while
        try {
            console.log("fetching");
            fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(resp => {
                    console.log(resp);
                    if (!resp.ok) {
                        console.log(`there was an issue logging in `);
                    }
                    else {
                        return resp.json();
                    }
                }).then(resp => {
                    console.log(resp);
                    cb(resp);
                })
                .catch(err => {
                    console.log(err);
                })
        }
        catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    focusItem = (event) => {
        event.preventDefault();
        console.log(event.target.getAttribute('data-id'));
        this.setState({focusing: event.target.getAttribute('data-id')});
    }

    componentDidMount() {
        console.log(!!this.props.match.params.id);
        const focusing = !!this.props.match.params.id;
        //const focusing = !!this.props.match.params.id;
        this.getEvents((data) => {
            console.log(data);
            if (data) {
                this.setState({ data: data, focusing: focusing }, () => {
                    console.log(this.state.data);
                })
            }
            else {
                console.log("something went wrong");
            }
        });
    }

    renderUserEvents = () => {
        console.log('called user render');
        if (this.state.data) {
            return this.state.data.user.map(item => {
                console.log(item.id);
                return (
                    <tr key={item.id} className="listing-row">
                        <Link to={`/events/${item.id}`} className="listing-item-name"><td><span>{item.name}</span></td></Link>
                        <td><span className="listing-item listing-item-date"><Moment parse="YYYY-MM-DD" format="MM/DD/YY">{item.date}</Moment></span></td>
                        <td><span className="listing-item listing-item-cat">{item.category}</span></td>
                        <td><span className="listing-item listing-item-local">{item.distance} mi</span></td>
                        <td><span className="listing-item listing-item-votes">{item.upVotes}</span></td>
                        <td><span className="listing-item listing-item-id">{item.creatorID}</span></td>
                    </tr>
                );
            });
        }
    }

    renderAllEvents = () => {
        if (this.state.data) {
            return this.state.data.all.map(item => {
                return (
                    <tr key={item.id} className="listing-row" data-id={item.id}>
                        <Link to={`/events/${item.id}`} className="listing-item-name"><td><span>{item.name}</span></td></Link>
                        <td><span className="listing-item listing-item-date">{item.date}</span></td>
                        <td><span className="listing-item listing-item-cat">{item.category}</span></td>
                        <td><span className="listing-item listing-item-local">{item.distance} mi</span></td>
                        <td><span className="listing-item listing-item-votes">{item.upVotes}</span></td>
                        <td><span className="listing-item listing-item-id">{item.creatorID}</span></td>
                    </tr>
                );
            });
        }
    }
    
    updateEvents = (cb) => {
        this.getEvents(data => {
            this.setState({data: data}, cb);
        });
    }

    render() {
        return (
            <>

                {/* {!!this.state.focusing ? "" : <Bubble />} */}
                <Bubble loggedIn={this.props.loggedIn}/>
                <div id="dark-panel">
                    <div className="listings">


                        <div className="list-group user-listings">
                            <h3 className="listings-section">
                                YOUR EVENTS
                            </h3>
                            <div>
                                <table align="left" id="listings-table">
                                    <thead>
                                        <tr>
                                            <th><span className="listing-header">name</span></th>
                                            <th><span className="listing-header">date</span></th>
                                            <th><span className="listing-header">category</span></th>
                                            <th><span className="listing-header">distance</span></th>
                                            <th><span className="listing-header">rsvps</span></th>
                                            <th><span className="listing-header">delete</span></th>
                                        </tr>
                                    </thead>
                                    {this.renderUserEvents()}
                                </table>
                                <Link to="/create" className="new-event-btn">make new event</Link>
                                <br /><br /><br /><br />
                            </div>
                        </div>
                        <br />
                        <div className="list-group all-listings">
                            <h3 className="listings-section">
                                ALL EVENTS
                            </h3>
                            <div>
                                <table align="left" id="listings-table">
                                    <thead>
                                        <tr>
                                            <th><span className="listing-header">name</span></th>
                                            <th><span className="listing-header">date</span></th>
                                            <th><span className="listing-header">category</span></th>
                                            <th><span className="listing-header">distance</span></th>
                                            <th><span className="listing-header">rsvps</span></th>
                                            <th><span className="listing-header">creator</span></th>

                                        </tr>
                                    </thead>
                                    {this.renderAllEvents()}
                                </table>
                                <br /><br /><br /><br />
                            </div>
                        </div>
                    </div>
                </div>



                <div id="refer-box" onClick={this.props.toggleReferral} style={this.props.referralState ? { "display": "block" } : { "display": "none" }}>
                    IT WORKED
                </div>
            </>
        )
    }
}


export default Events;