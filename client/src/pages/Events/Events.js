import React from "react";
import { Link } from "react-router-dom";
import Bubble from "./../../components/Bubble/Bubble";
import Focus from './../Focus/Focus'
import './Events.css';

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

    componentDidMount() {
        const focusing = !!this.props.match.params.id;
        this.getEvents((data) => {
            console.log(data);
            if (data) {
                this.setState({ data: data, focusing: focusing });
            }
            else {
                console.log("something went wrong");
            }
        });
    }

    renderEvents = (data) => {
        if (data) {
            return data.map(item => {
                return (
                    <tr key={item.id} className="listing-row" data-id={item.id}>
                        <td><Link to={`/events/${item.id}`} className="listing-item-name">{item.name}</Link></td>
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
                {!!this.state.focusing ? null : <Bubble />}
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
                                    <tbody>
                                        {!!this.state.data ? this.renderEvents(this.state.data.user) : null}
                                    </tbody>
                                </table>
                                <Link to="/create" className="new-event-btn">make new event</Link>
                            </div>
                        </div>
                        
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
                                    <tbody>
                                        {!!this.state.data ? this.renderEvents(this.state.data.all) : null}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>



                <div id="refer-box" onClick={this.props.toggleReferal} style={this.props.referalState ? { "display": "block" } : { "display": "none" }}>
                    IT WORKED
                </div>
            </>
        )
    }
}


export default Events;