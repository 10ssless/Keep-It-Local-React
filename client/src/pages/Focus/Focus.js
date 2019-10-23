import React from "react";
import Moment from "react-moment"
import './Focus.css';
import 'moment-timezone';

class Focus extends React.Component {

    state = {
        //fetched from our API 
        eventName: null,
        description: null,
        numRSVP: null,
        location: null,
        date: null,
        creatorID: null,
        newMessage: null,
        messages: null,
        // when the edit button is clicked the page will respond
        // immediatelyyyy
        editing: false,

        //the new text for name and description when the event is being edited
        newName: null,
        newDescription: null
    }

    componentDidUpdate(prevProps, prevState) {
        const { id } = this.props.match.params;
        // only fetch data if a new event is selected - rather than fetch data that is already there
        if (id !== prevProps.match.params.id) {
            this.fetchInformation(id, data => {
                this.setState({ eventName: data.name, description: data.description, numRSVP: data.upVotes, location: data.location, date: data.date, creatorID: data.creatorID }, () => {
                    this.fetchMessages(id, messages => {
                        this.setState({ messages: messages });
                    })
                });
            })
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.fetchInformation(id, (data)=> {
            this.setState({ eventName: data.name, description: data.description, numRSVP: data.upVotes, location: data.location, date: data.date, creatorID: data.creatorID }, () => {
                this.fetchMessages(id, (messages) => {
                    this.setState({ messages: messages });
                })
            });
        })
    }

    fetchInformation = (id, cb) => {
        fetch(`/api/event/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            else {
                console.log('couldnt get event details');
                return;
            }
        }).then(data => {
            if (data) {
                cb(data);
            }
        })
    }

    fetchMessages = (id, cb) => {
        fetch(`/api/messages/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            else {
                console.log('couldnt get event details');
                return;
            }
        }).then(data => {
            if (data) {
                cb(data);
            }
        })
    }

    fetchUpdateEvent = (id, cb) => {
        fetch(`/api/event/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.newName,
                description: this.state.newDescription
            })
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            else {
                console.log('couldnt get event details');
                return;
            }
        }).then(data => {
            if (data) {
                cb(data);
            }
        })
    }

    renderMessages = () => {
        if (this.state.messages) {
            return (
                this.state.messages.map(item => {
                    let dateTime = item.createdAt;
                    dateTime = dateTime.split(', ');
                    const date = dateTime[0];
                    const time = dateTime[1];
                    return (
                        <li>
                            <span className="msg-date"><Moment format="MMMM D, YYYY">{date}</Moment></span>
                            <span className="msg-time"><Moment format="MM:ss A" tz="America/New_York">{time}</Moment></span>
                            <span className="msg-user">{item.creatorID}</span>
                            {item.content}
                        </li>
                    );
                })
            );
        }
    };

    makeRSVP = (event) => {
        event.preventDefault();
        fetch(`/api/rsvp`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            else {
                console.log('couldnt rsvp');
                return;
            }
        }).then(data => {
            if (data) {
                this.setState({ numRSVP: this.state.numRSVP + 1 });
            }
        })
    }

    editClick = (event) => {
        event.preventDefault();
        if (this.state.editing) {
            const { id } = this.props.match.params;
            this.fetchUpdateEvent(id, (resp) => {
                const descr = this.state.newDescription;
                const name = this.state.newName;
                this.setState({ editing: false, eventName: name, description: descr, newName: null, newDescription: null });
            });
        }
        else {
            this.setState({ editing: true, newName: this.state.eventName, newDescription: this.state.description });
        }
    }

    onTextChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    submitMessage = () => {
        const { id } = this.props.match.params;
        fetch(`/api/message`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                content: this.state.newMessage
            })
        }).then(resp => {
            if (resp.ok) {
                this.fetchMessages(data => {
                    this.setState({ messages: data });
                })
            }
            else {
                console.log(`couldn't submit the message`);
            }
        })
    }

    render() {
        return (
            <>
                <div id="event-main">
                    {this.state.editing ?
                        <>
                            <h1 id="message-header"><input name="newName" className="event-name" type="text" value={this.state.newName} onChange={event => this.onTextChange(event)} /></h1>
                            <div id="message-description">
                                <input id="description" className="event" type="text" name="newDescription" value={this.state.newDescription} onChange={event => this.onTextChange(event)} />
                            </div>
                            <p className="event"><span id="rsvp-count" className="event-votes">{this.state.numRSVP}</span> rsvps for this event.</p>
                            <p className="event"> located at <span className="event-location">{this.state.location}</span></p>
                            <p className="event"> on <span className="event-date">{this.state.date}</span></p>
                            <p className="event">hosted by <span className="event-creator">{this.state.creatorID}</span></p>
                            <button type="button" id="side-btn" className="edit-btn" onClick={event => this.editClick(event)}>Complete Edit</button>
                        </>
                        :
                        <>
                            <h1 id="message-header"><span className="event-name">{this.state.eventName}</span></h1>
                            <div id="message-description">
                                <p id="description" className="event">{this.state.description}</p>
                            </div>
                            <p className="event"><span id="rsvp-count" className="event-votes">{this.state.numRSVP}</span> rsvps for this event.</p>
                            <p className="event"> located at <span className="event-location">{this.state.location}</span></p>
                            <p className="event"> on <span className="event-date"><Moment parse="YYYY-MM-DD" format="MMMM D, YYYY">{this.state.date}</Moment></span></p>
                            <p className="event">hosted by <span className="event-creator">{this.state.creatorID}</span></p>
                            {/*this check should be a backend route, but for now keep it as front-end check*/}
                            {this.props.currentUser === this.state.creatorID ? <button type="button" id="side-btn" className="edit-btn" onClick={event => this.editClick(event)}>edit this event</button> : <button type="button" id="side-btn" className="rsvp-btn" onClick={(event) => this.makeRSVP(event)}>rsvp to this event</button>}
                        </>
                    }

                    <div id="messages">
                        <h4>Messages</h4>
                        <ul id="messages-list">
                            {this.renderMessages()}
                        </ul>
                        <input type="text" id="new-msg" placeholder="new message" name="newMessage" onChange={event => this.onTextChange(event)} />
                        <button type="button" className="msg-btn" onClick={this.submitMessage}>post</button>
                    </div>
                </div>
            </>
        )
    }
}

export default Focus;