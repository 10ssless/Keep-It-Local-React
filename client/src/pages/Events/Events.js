import React from "react";
import { Link } from "react-router-dom";
import Bubble from "./../../components/Bubble/Bubble";
import Footer from "./../../components/Footer/Footer";
import './Events.css';

class Events extends React.Component{

    state={}
    
    render(){
        return(
            <>
                <Bubble/>

                <div id="dark-panel">
                    <div class="listings">
                        

                        <div class="list-group user-listings">
                            <h3 class="listings-section">
                                YOUR EVENTS
                            </h3>
                            <div>
                                <table align="left" id="listings-table">
                                <tr>
                                    <th><span class="listing-header">name</span></th> 
                                    <th><span class="listing-header">date</span></th> 
                                    <th><span class="listing-header">category</span></th> 
                                    <th><span class="listing-header">distance</span></th> 
                                    <th><span class="listing-header">rsvps</span></th> 
                                    <th><span class="listing-header">delete</span></th>
                                </tr>
                                    {/* MAP FROM STATE */}
                                    {/* <tr class="listing-row" data-id="{{this.id}}">
                                        <td><span class="listing-item listing-item-name"><a href="/events/{{this.id}}" class="event-link" data-id="{{this.id}}">{{this.name}}</a></span></td>
                                        <td><span class="listing-item listing-item-date">{{moment this.date "MM/DD/YY"}}</span></td>
                                        <td><span class="listing-item listing-item-cat">{{this.category}}</span></td>
                                        <td><span class="listing-item listing-item-local">{{this.distance}} mi</span></td>
                                        <td><span class="listing-item listing-item-votes">{{this.upVotes}}</span></td>
                                        <td><span class="listing-item listing-item-id">{{this.creatorID}}</span></td>
                                    </tr> */}

                                </table>
                                <Link to="/create" class="new-event-btn">make new event</Link>
                                <br/><br/><br/><br/>
                            </div>
                        </div>
                        <br/>
                        <div class="list-group all-listings">
                            <h3 class="listings-section">
                                ALL EVENTS
                            </h3>
                            <div>
                                <table align="left" id="listings-table">
                                <tr>
                                
                                    <th><span class="listing-header">name</span></th>
                                    <th><span class="listing-header">date</span></th>
                                    <th><span class="listing-header">category</span></th>
                                    <th><span class="listing-header">distance</span></th>
                                    <th><span class="listing-header">rsvps</span></th>
                                    <th><span class="listing-header">creator</span></th>
                                
                                </tr>
                                    {/* MAP FROM STATE */}
                                    {/* <tr class="listing-row" data-id="{{this.id}}">
                                        <td><span class="listing-item listing-item-name"><a href="/events/{{this.id}}" class="event-link" data-id="{{this.id}}">{{this.name}}</a></span></td>
                                        <td><span class="listing-item listing-item-date">{{moment this.date "MM/DD/YY"}}</span></td>
                                        <td><span class="listing-item listing-item-cat">{{this.category}}</span></td>
                                        <td><span class="listing-item listing-item-local">{{this.distance}} mi</span></td>
                                        <td><span class="listing-item listing-item-votes">{{this.upVotes}}</span></td>
                                        <td><span class="listing-item listing-item-id">{{this.creatorID}}</span></td>
                                    </tr> */}

                                </table>
                                <br/><br/><br/><br/>
                            </div>
                        </div>
                    </div>


                </div>



                <div id="refer-box"></div>


                <Footer />
            </>
        )
    }
}


export default Events;