import React, {Component} from 'react';
import axios from 'axios';
import './TemplatePage'
import '../App.css';
import TemplatePage from "./TemplatePage";

class Reference extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 1
        };
    }

    test() {
        alert("hello!");
        this.setState(
            {
                number: this.state.number + 1
            }
        )
    }

    render() {
        //You can't declare variables or put "var ... = ..." in between the constructor and render, so if you want to declare
        //variables you either have to do it in between render and return or do it in state.
        var arrayOfNums = [1, 4, 9, 16];
        return (
            <div>
                <p>Anything in return is displayed on the page</p>
                <p>Everything in return also has to be inside one encompassing element. In our case we made it a
                    div.</p>
                <br />



                <p>Anything in curly braces is interpreted as javascript and will display whatever it returns</p>
                <p>3 + 4 is {3 + 4}</p>
                <br />


                <p>Even if you return an array, it'll still display that. { [1, 2, 3, 4] }. But it looks crunched,
                    since there are no spaces between arrays when react prints them out.</p>
                <p>
                    This is useful for using html, since it doesn't need spacing or spaces. { [<div>John</div>,
                    <div>Joe</div>, <div>Tom</div>, <div>Jack</div>] }
                </p>


                <p>Map is a function that operates on an array. It iterates through each element and performs an
                    operation
                    on it. Then it returns an array with all those modified elements.
                    [1, 4, 9, 16] becomes [2, 8, 18, 32]
                    {
                        arrayOfNums.map(function (number) {
                                return <em>{number * 2}</em>
                            }
                        )
                    }
                    {/*Same as below, but with arrow functions instead of the normal function*/}
                    {
                        arrayOfNums.map((number) => {
                                return <em>{number * 2}</em>
                            }
                        )
                    }
                    {/*It's better to use arrow functions though, since "this" doesn't work properly in normal functions! */}
                </p>
                <p>But that looks all squashed! With react, whenever you return html, it has to only have one parent
                    tag.
                    {
                        arrayOfNums.map((number) => {
                                return <div>
                                    <em>{number * 2}</em>
                                    <br />
                                </div>
                            }
                        )
                    }
                    So we could encompass it in a div tag as above, or we could use an array as below.
                    {
                        arrayOfNums.map((number) => {
                                return [<em>{number * 2}</em>, <br />]
                            }
                        )
                    }
                </p>
                <br />


                <p>You can also use conditionals to display information. But you have to use the ternary operator
                    { 1 + 1 === 3 ? "1 + 1 = 3" : "1 + 1 != 3" }
                    If you need to use a full-fledged if statement, read here:
                    https://react-cn.github.io/react/tips/if-else-in-JSX.html
                </p>
                <br />


                <p>If you want to call a functoin called when something is clicked, you have to bind it.
                    The only thing that changes in that statement below is "test", the rest can be copied and pasted
                    These functions should be defined in between the constructor and render.
                </p>
                <button onClick={this.test.bind(this)}/>


                <p>If you ever want to put something on the page that won't be static and has the chance to change,
                store it in state.</p>
                <p>State is a javascript object (like Python dictionary. We can access it using the "this" keyword.</p>
                <p>number: {this.state.number}</p>
                <p>Whenever you use the setState function, react looks for every mention of that variable and updates it</p>
                <p>The button calls the setState function and sets number equal to number + 1. Click it to see the number
                increment.</p>


                <p>Whenever a page has "export default (name of page)", then that means you can make it a tag - as long
                as your import it. For example, this page is called Reference.js. the TemplatePage.js has export default
                TemplatePage. If we do "import "./TemplatePage" at the top of this file (Reference.js), then we can use
                the TemplatePage tag. Then all the code in the "render" in TemplatePage will appear here.</p>
                <TemplatePage/>
            </div>
        );
    }
}

export default Reference;
