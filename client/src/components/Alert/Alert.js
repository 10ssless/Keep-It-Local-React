import React from 'react';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const config = {
    success: {
        header: "You have successfully logged in! Welcome!",
        body: "Feel free to create new events, look at existing ones, and comment on events you're interested in going to",

    },
    danger: {
        header: "There was an issue logging you in. Try again!",
        body: "Make sure you're using a valid username and password!"
    }
}

export default function AuthenticationAlert(props) {
    const { type, closeAlert } = props;
    const { header, body } = config[type];

    if (type) {
        return (
            <Alert variant={type} onClose={() => closeAlert()} dismissible>
                <Alert.Heading>{header}</Alert.Heading>
                <p>
                    {body}
                </p>
            </Alert>
        );
    }
}
