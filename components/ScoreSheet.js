import React from "react";
import css from "../styles/Home.module.css";

class ScoreSheet extends React.Component {
    constructor(props) {
      super(props);
      this.state = { scoreArray: this.props.scoreArray };   
      this.handleClick = this.handleClick.bind(this);   
    }  

    handleClick = () => {
      
    } 

    render() {      
      return (
        <div className={css.scoresheet}>
          <span className={css.scoresheet_Aces}>{this.state.scoreArray.Aces}</span>
          <span className={css.scoresheet_Twos}>{this.state.scoreArray.Twos}</span>
          <span className={css.scoresheet_Threes}>{this.state.scoreArray.Threes}</span>
          <span className={css.scoresheet_Fours}>{this.state.scoreArray.Fours}</span>
          <span className={css.scoresheet_Fives}>{this.state.scoreArray.Fives}</span>
          <span className={css.scoresheet_Sixes}>{this.state.scoreArray.Sixes}</span>
          <span className={css.scoresheet_TotalScore}>{this.state.scoreArray.TotalScore}</span>
          <span className={css.scoresheet_Bonus}>{this.state.scoreArray.Bonus}</span>
          <span className={css.scoresheet_TotalScoreUpperSection}>{this.state.scoreArray.TotalScoreUpperSection}</span> 
          <span className={css.scoresheet_ThreeOfAKind}>{this.state.scoreArray.ThreeOfAKind}</span>
          <span className={css.scoresheet_FourOfAKind}>{this.state.scoreArray.FourOfAKind}</span>
          <span className={css.scoresheet_FullHouse}>{this.state.scoreArray.FullHouse}</span>
          <span className={css.scoresheet_SmStraight}>{this.state.scoreArray.SmStraight}</span>
          <span className={css.scoresheet_LgStraight}>{this.state.scoreArray.LgStraight}</span>
          <span className={css.scoresheet_Yahtzee}>{this.state.scoreArray.Yahtzee}</span>
          <span className={css.scoresheet_Chance}>{this.state.scoreArray.Chance}</span>
          <span className={css.scoresheet_TotalUpper}>{this.state.scoreArray.TotalUpper}</span> 
          <span className={css.scoresheet_TotalLower}>{this.state.scoreArray.TotalLower}</span> 
          <span className={css.scoresheet_Total}>{this.state.scoreArray.Total}</span> 
        </div>
      );
    }
}

export default ScoreSheet;