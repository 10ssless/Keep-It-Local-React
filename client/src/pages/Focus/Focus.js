import React from "react";
import './Focus.css';

class Focus extends React.Component {

    state = {
        eventName: null,
        description: null,
        numRSVP: null,
        location: null,
        date: null,
        creatorID: null,
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
                    console.log(messages);
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
                console.log(data);
                cb(data);
            }
        })
    }

    renderMessages = () => {
        console.log('called');
        console.log(this.state.messages);
        if (this.state.messages) {
            return(
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

    render() {
        return (
            <>
                <div id="event-main">
                    <h1 id="message-header"><span class="event-name">{this.state.eventName}</span></h1>

                    <br /><br />

                    <div id="message-description">
                        <p id="description" class="event">{this.state.description}</p>
                    </div>

                    <p class="event"><span id="rsvp-count" class="event-votes">{this.state.numRSVP}</span> rsvps for this event.</p>
                    <p class="event"> located at <span class="event-location">{this.state.location}</span></p>
                    <p class="event"> on <span class="event-date">{this.state.date}</span></p>
                    <p class="event">hosted by <span class="event-creator">{this.state.creatorID}</span></p>
                    {this.props.currentUser === this.state.creatorID ? <button type="button" id="side-btn" class="edit-btn" >edit this event</button> : <button type="button" id="side-btn" class="rsvp-btn" data-id="{{select_event.data.id}}">rsvp to this event</button>}
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