import React from "react";
import Bubble from "./../../components/Bubble/Bubble";
import './Create.css';
import history from '../../history';

class Create extends React.Component{
    state={
        name: null,
        date: null,
        category: null,
        location: null,
        description: null,
    }

    handleChange = (event) => {
        this.setState({[event.target.name]:event.target.value})
    }

    createEvent = (event) => {
        event.preventDefault();
        fetch(`/api/events/newEvent`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                location: this.state.location,
                date: this.state.date,
                description: this.state.description,
                category: this.state.category,
                name: this.state.name
            })
        }).then(resp => {
            if(resp.ok){
                history.push('/events');
            }
            else{
                console.log(`could not create event`);
                //show some pop up saying it failed
            }
        });
    }

    render(){
        return(
            <>
                <Bubble loggedIn={this.props.loggedIn} focus={null}/>

                <div id="dark-panel">
                    <br/><br/><br/>
                    <div id="quote">
                        <h1>create a new event.</h1>
                    </div>
                    <br/><br/><br/>
                    <div class="create">
                        <form id="create-form" onSubmit={event => this.createEvent(event)}>
                            <label for="name" >name of event</label>
                            <input type="text" id="eventName" name="name" placeholder="Event Name" onChange={event => this.handleChange(event)} required/>

                            <label for="eventDate">date of event</label>
                            <input type="date" id="eventDate" name="date" onChange={event => this.handleChange(event)} required/>

                            <label for="category">category</label>
                            <input type="text" id="category" name="category" placeholder="Comedy, Music, Party, etc." onChange={event => this.handleChange(event)} required/>

                            <label for="location">location</label>
                            <input type="text" id="location" name="location" placeholder="### adddress st, city, state" onChange={event => this.handleChange(event)} required/>

                            <label for="description">description</label>
                            <textarea id="details" name="description" placeholder="start time, dress code, byob, etc. " onChange={event => this.handleChange(event)} wrap="hard"></textarea>

                            <button type="submit" id="create-btn" onClick={event => this.createEvent(event)}>create event</button>
                        </form>
                    </div>
                </div>
            </>
        )
    }

}



export default Create;