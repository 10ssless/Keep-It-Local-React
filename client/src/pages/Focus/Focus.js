import React from "react";
import './Focus.css';

class Focus extends React.Component{
    
    state={}

    render(){
        return(
            <>
            


            <div id="event-main">
                <h1 id="message-header"><span class="event-name">Event Name</span></h1>

                <br/><br/>

                <div id="message-description">
                    <p id="description" class="event">Description</p>
                </div>
                
                <p class="event"><span id="rsvp-count" class="event-votes">0</span> rsvps for this event.</p>
                <p class="event"> located at <span class="event-location">Edison, NJ</span></p>
                <p class="event"> on <span class="event-date">Oct 10, 2019</span></p>
                <p class="event">hosted by <span class="event-creator">zubin</span></p>
                <button type="button" id="side-btn" class="edit-btn" data-id="{{select_event.data.id}}">edit this event</button>
                {/* <button type="button" id="side-btn" class="rsvp-btn" data-id="{{select_event.data.id}}">rsvp to this event</button> */}
                <br/><br/>

                <div id="messages">
                    <br/>
                    <h4>Messages</h4>
                    <ul id="messages-list">
                        {/* MAP FROM MSGS */}
                            <li><span class="msg-date">Sept 30, 2019</span> <span class="msg-time">4:38 PM</span> <span class="msg-user">zubin</span> yo </li>
                            <li><span class="msg-date">Sept 30, 2019</span> <span class="msg-time">4:39 PM</span> <span class="msg-op">scott</span> wassup </li>
                        <br/><br/>
                    </ul>
                    <input type="text" id="new-msg" placeholder="new message"/>
                    <button type="button" class="msg-btn" data-id="{{select_event.data.id}}">post</button>
                </div>
            </div>
            </>
        )
    }
}

export default Focus;