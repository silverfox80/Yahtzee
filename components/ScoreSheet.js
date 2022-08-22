import React from "react";
import css from "../styles/Home.module.css";

class ScoreSheet extends React.Component {
    constructor(props) {
      super(props);
      this.state = { scoreArray: this.props.scoreArray };   
      this.handleClick = this.handleClick.bind(this);   
    }  

    handleClick = (el) => {
      console.log(el.target)
    } 

    render() {      
      return (
        <div className={css.scoresheet}>
          <span onClick={this.handleClick} className={css.scoresheet_Aces}>{this.state.scoreArray.Aces}</span>
          <span onClick={this.handleClick} className={css.scoresheet_Twos}>{this.state.scoreArray.Twos}</span>
          <span onClick={this.handleClick} className={css.scoresheet_Threes}>{this.state.scoreArray.Threes}</span>
          <span onClick={this.handleClick} className={css.scoresheet_Fours}>{this.state.scoreArray.Fours}</span>
          <span onClick={this.handleClick} className={css.scoresheet_Fives}>{this.state.scoreArray.Fives}</span>
          <span onClick={this.handleClick} className={css.scoresheet_Sixes}>{this.state.scoreArray.Sixes}</span>
          <span onClick={this.handleClick} className={css.scoresheet_TotalUpperNoBonus}>{this.state.scoreArray.TotalUpperNoBonus}</span>
          <span onClick={this.handleClick} className={css.scoresheet_Bonus}>{this.state.scoreArray.Bonus}</span>
          <span onClick={this.handleClick} className={css.scoresheet_TotalScoreUpperSection}>{this.state.scoreArray.TotalUpper}</span> 
          <span onClick={this.handleClick} className={css.scoresheet_ThreeOfAKind}>{this.state.scoreArray.ThreeOfAKind}</span>
          <span onClick={this.handleClick} className={css.scoresheet_FourOfAKind}>{this.state.scoreArray.FourOfAKind}</span>
          <span onClick={this.handleClick} className={css.scoresheet_FullHouse}>{this.state.scoreArray.FullHouse}</span>
          <span onClick={this.handleClick} className={css.scoresheet_SmStraight}>{this.state.scoreArray.SmStraight}</span>
          <span onClick={this.handleClick} className={css.scoresheet_LgStraight}>{this.state.scoreArray.LgStraight}</span>
          <span onClick={this.handleClick} className={css.scoresheet_Yahtzee}>{this.state.scoreArray.Yahtzee}</span>
          <span onClick={this.handleClick} className={css.scoresheet_Chance}>{this.state.scoreArray.Chance}</span>
          <span onClick={this.handleClick} className={css.scoresheet_TotalUpper}>{this.state.scoreArray.TotalUpper}</span> 
          <span onClick={this.handleClick} className={css.scoresheet_TotalLower}>{this.state.scoreArray.TotalLower}</span> 
          <span onClick={this.handleClick} className={css.scoresheet_Total}>{this.state.scoreArray.Total}</span> 
        </div>
      );
    }
}

export default ScoreSheet;