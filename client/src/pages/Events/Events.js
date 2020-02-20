import React from "react";
import { Link } from "react-router-dom";
import Bubble from "./../../components/Bubble/Bubble";
import './Events.css';
import Moment from "react-moment"
import 'moment-timezone';
import Focus from "../Focus/Focus"

class Events extends React.Component {

    state = {
        data: null,
        fetching: false,
        focusing: false
    }

    // on mount, load events into state 
    componentDidMount() {
        console.log(!!this.props.match.params.id);
        const focusing = !!this.props.match.params.id;
        this.getEvents((data) => {
            console.log(data);
            if (data) {
                this.setState({ 
                    data: data, 
                    focusing: focusing 
                }, () => {
                    console.log(this.state.data);
                })
            }
            else {
                console.log("something went wrong");
            }
        });
    }

    // helper function to fetch events from database
    getEvents = (cb) => {
        const url = '/api/events/allUserandArea';
        this.setState({ fetching: true }); //can be used to display some loading animation or something because the loading process can take a little while
        try {
            fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(resp => {
                    if (!resp.ok) {
                        console.log(`there was an issue logging in `);
                    }
                    else {
                        return resp.json();
                    }
                }).then(resp => {
                    cb(resp);
                })
                .catch(err => {
                    console.log(`there was an issue logging in `);
                    console.log(err);
                })
        }
        catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    // componentDidMount() {
    //     console.log('mounting');
    //     const focusing = !!this.props.match.params.id;
    //     this.getEvents((data) => {
    //         if (data) {
    //             this.setState({ data: data, focusing: focusing });
    //         }
    //         else {
    //             console.log("something went wrong");
    //         }
    //     });
    // }

    renderEvents = (data) => {
        if (data) {
            return data.map(item => {
                console.log(data);
                // const dateRaw = item.date.split('-');
                // const date = `${dateRaw[1]}/${dateRaw[2]}/${dateRaw[0]}`;
                // data.date = date;
                return (
                    <tr key={item.id} className="listing-row" data-id={item.id}>
                        <td><Link to={`/events/${item.id}`} className="listing-item-name">{item.name}</Link></td>
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
    
    // call getEvents again to update event listings
    updateEvents = (cb) => {
        this.getEvents(data => {
            this.setState({data: data}, cb);
        });
    }

    render() {
        console.log("this.state.focusing")
        console.log(this.state.focusing)
        return (
            <>
                <Bubble loggedIn={this.props.loggedIn} focus={this.state.focusing}/>
                {!!this.state.focusing ? <Focus updateEvents={this.updateEvents} {...this.props}/> : null}
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
            </>
        )
    }
}

Events.defaultProps = {
    focusing: false
}


export default Events;