import React from "react";
import Bubble from "./../../components/Bubble/Bubble";
import Footer from "./../../components/Footer/Footer";
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
        console.log({[event.target.name]:event.target.value});
        this.setState({[event.target.name]:event.target.value})
    }

    createEvent = (event) => {
        event.preventDefault();
        fetch(`/api/event`, {
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
                //console.log(resp);
                history.push('/events');
            }
            else{
                console.log(`could not create event`);
                //show some pop up saying it failed
            }
        }).then(data =>{
            console.log(data);
        })
    }

    render(){
        return(
            <>
                <Bubble/>

                <div id="dark-panel">
                    
                    <br/><br/>

                    <div id="quote">
                        <h1>create a new event.</h1>
                    </div>

                    <br/><br/>

                    <div class="create">
                        <form id="create-form" onSubmit={event => this.createEvent(event)}>
                            <label>name of event</label>
                            <input type="text" name="name" placeholder="Event Name" onChange={event => this.handleChange(event)} required/><br/>

                            <label>date of event</label>
                            <input type="date" id="eventDate" name="date" onChange={event => this.handleChange(event)} required/><br/>

                            <label>category</label>
                            <input type="text" id="category" name="category" placeholder="Comedy, Music, Party, etc." onChange={event => this.handleChange(event)} required/><br/>

                            <label>location</label>
                            <input type="text" id="location" name="location" placeholder="### adddress st, city, state" onChange={event => this.handleChange(event)} required/><br/>

                            <label>description</label>
                            <textarea id="details" name="description" placeholder="start time, dress code, byob, etc. " onChange={event => this.handleChange(event)} wrap="hard"></textarea>

                            <button type="submit" id="create-btn" onClick={event => this.createEvent(event)}>create event</button>
                        </form>
                    </div>
                </div>



                <div id="refer-box" onClick={this.props.toggleReferal} style={this.props.referalState ? {"display":"block"} : {"display":"none"} }>
                    IT WORKED
                </div>


                <Footer loggedIn={this.props.loggedIn} toggleReferal={this.props.toggleReferal}/>
            </>
        )
    }

}



export default Create;