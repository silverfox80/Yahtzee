import React from "react";
import Die from "./Die";


class DieWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {active: this.props.active, index:this.props.index};   
      this.handleClick = this.handleClick.bind(this);   
    }
    randomVal = () => {
        return [  Math.floor(Math.random() * 8 * Math.PI / 4) , 
                  Math.floor(Math.random() * 8 * Math.PI / 4) ,
                  Math.floor(Math.random() * 8 * Math.PI / 4) ];
    }

    handleClick = () => {
      this.setState(prevState => ({
        active: !prevState.active
      }));
    }    

    render() {      
      return (
        <Die active={this.state.active} index={this.props.index} position={[0, 15, 0]} rotation={this.randomVal()} />
      );
    }
}

export default DieWrapper;