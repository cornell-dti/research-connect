import React, {Component} from 'react';

class TemplatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        return (
            <div>
                Your {this.props.aName} here
            </div>
        );
    }
}

export default TemplatePage;