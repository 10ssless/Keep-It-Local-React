import React from "react";
import './Focus.css';

class Focus extends React.Component {

    state = {
        //fetched from our API
        eventName: null,
        description: null,
        numRSVP: null,
        location: null,
        date: null,
        creatorID: null,
        // when the edit button is clicked the page will respond
        editing: false,
        //the new text for name and description when the event is being edited
        newName: null,
        newDescription: null
    }

    componentDidUpdate(prevProps, prevState) {
        // only fetch data if a new event is selected - rather than fetch data that is already there
        if (this.props.eventID !== prevProps.eventID) {
            this.fetchInformation(data => {
                this.setState({ eventName: data.name, description: data.description, numRSVP: data.upVotes, location: data.location, date: data.date, creatorID: data.creatorID }, () => {
                    this.fetchMessages(messages => {
                        this.setState({ messages: messages });
                    })
                });
            })
        }
    }

    componentDidMount() {
        this.fetchInformation(data => {
            this.setState({ eventName: data.name, description: data.description, numRSVP: data.upVotes, location: data.location, date: data.date, creatorID: data.creatorID }, () => {
                this.fetchMessages(messages => {
                    //console.log(messages);
                    this.setState({ messages: messages });
                })
            });
        })
    }

    fetchInformation = (cb) => {
        fetch(`/api/event/${this.props.eventID}`, {
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

    fetchMessages = (cb) => {
        fetch(`/api/messages/${this.props.eventID}`, {
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
                //console.log(data);
                cb(data);
            }
        })
    }

    fetchUpdateEvent = (cb) => {
        fetch(`/api/event/${this.props.eventID}`, {
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
                console.log(data);
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
                            <span class="msg-date">{date}</span>
                            <span class="msg-time">{time}</span>
                            <span class="msg-user">{item.creatorID}</span>
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
            console.log(resp);
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
            this.fetchUpdateEvent((resp) => {
                const descr = this.state.newDescription;
                const name = this.state.newName;
                this.props.updateEvents(() => { // re-fetches the events in the Events component so the name is updated if needed
                this.setState({ editing: false, eventName: name, description: descr, newName: null, newDescription: null }, ()=>{console.log(this.state)});
                });
            });
        }
        else {
            this.setState({ editing: true, newName: this.state.eventName, newDescription: this.state.description });
        }
    }

    onTextChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        return (
            <>
                <div id="event-main">
                    {this.state.editing ?
                        <>
                            <h1 id="message-header"><input name="newName" class="event-name" type="text" value={this.state.newName} onChange={event => this.onTextChange(event)} /></h1>
                            <br /><br />
                            <div id="message-description">
                                <input id="description" class="event" type="text" name="newDescription" value={this.state.newDescription} onChange={event => this.onTextChange(event)} />
                            </div>
                            <p class="event"><span id="rsvp-count" class="event-votes">{this.state.numRSVP}</span> rsvps for this event.</p>
                            <p class="event"> located at <span class="event-location">{this.state.location}</span></p>
                            <p class="event"> on <span class="event-date">{this.state.date}</span></p>
                            <p class="event">hosted by <span class="event-creator">{this.state.creatorID}</span></p>
                            <button type="button" id="side-btn" class="edit-btn" onClick={event => this.editClick(event)}>Complete Edit</button>
                        </>
                        :
                        <>
                            <h1 id="message-header"><span class="event-name">{this.state.eventName}</span></h1>
                            <br /><br />
                            <div id="message-description">
                                <p id="description" class="event">{this.state.description}</p>
                            </div>
                            <p class="event"><span id="rsvp-count" class="event-votes">{this.state.numRSVP}</span> rsvps for this event.</p>
                            <p class="event"> located at <span class="event-location">{this.state.location}</span></p>
                            <p class="event"> on <span class="event-date">{this.state.date}</span></p>
                            <p class="event">hosted by <span class="event-creator">{this.state.creatorID}</span></p>
                            {this.props.currentUser === this.state.creatorID ? <button type="button" id="side-btn" class="edit-btn" onClick={event => this.editClick(event)}>edit this event</button> : <button type="button" id="side-btn" class="rsvp-btn" onClick={(event) => this.makeRSVP(event)}>rsvp to this event</button>}
                        </>
                    }
                    {/*this check should be a backend route, but for now keep it as front-end check*/}
                    <br /><br />

                    <div id="messages">
                        <br />
                        <h4>Messages</h4>
                        <ul id="messages-list">
                            {this.renderMessages()}
                            <br /><br />
                        </ul>
                        <input type="text" id="new-msg" placeholder="new message" />
                        <button type="button" class="msg-btn" data-id="{{select_event.data.id}}">post</button>
                    </div>
                </div>
            </>
        )
    }
}

export default Focus;