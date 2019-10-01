import React from "react";
import Bubble from "./../../components/Bubble/Bubble";
import Footer from "./../../components/Footer/Footer";
import './Create.css';

class Create extends React.Component{
    state={}
    render(){
        return(
            <>
                <Bubble/>

                <div id="dark-panel">
                    
                    <br/><br/>

                    <div id="quote">
                        <h1>create <br/>  a new event.</h1>
                    </div>

                    <br/><br/>

                    <div class="create">
                        <form id="create-form">
                            <label>name of event</label>
                            <input type="text" id="eventName" name="eventName" placeholder="Event Name" required/><br/>

                            <label>date of event</label>
                            <input type="date" id="eventDate" name="eventDate" required/><br/>

                            <label>category</label>
                            <input type="text" id="category" name="category" placeholder="Comedy, Music, Party, etc." required/><br/>

                            <label>location</label>
                            <input type="text" id="location" name="location" placeholder="### adddress st, city, state" required/><br/>

                            <label>description</label>
                            <textarea id="details" placeholder="start time, dress code, byob, etc. " wrap="hard"></textarea>

                            <button type="submit" id="create-btn">create event</button>
                        </form>
                    </div>
                </div>



                <div id="refer-box"></div>


                <Footer />
            </>
        )
    }

}



export default Create;