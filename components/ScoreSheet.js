import React from "react";
import css from "../styles/Home.module.css";

class ScoreSheet extends React.Component {
    
  constructor(props) {
      super(props);
      this.state = { score: this.props.scoreArray, confirmedScore: this.props.confirmedScoreArray };   
      this.handleClick = this.handleClick.bind(this);   
    }  
    /*
    componentDidMount() {
      console.log("ComponentDidMount");
    }
    componentWillUnmount() {
      console.log("componentWillUnmount");
    }
    
    shouldComponentUpdate(nextProps, nextState) {
      console.log("ShouldComponentUpdate");
      return true;
    }
    */
    componentDidUpdate(nextProps, nextState) {
      //console.log("componentDidUpdate");
      //Callback to update the Confirmed Score on the main component      
      this.props.onChangeConfirmedScore(nextState.confirmedScore)
      
      console.log(this.state.score)
      console.log(this.state.confirmedScore)
    }

    handleClick = (el) => {
      //const scoreObj = [ el.target.id, el.target.textContent ]
      let confirmedScoreMap = this.state.confirmedScore;
      confirmedScoreMap.set(el.target.id,parseInt(el.target.textContent))
      //set score taken
      this.setState(() => ({
        confirmedScore: confirmedScoreMap
      }));
      //console.log(this.state)      
    }

    render() {      
      return (
        <div className={css.scoresheetWrapper}>
          <div className={css.scoresheet}>
            <span id="Aces"    onClick={this.handleClick} className={`${css.scoresheet_Aces} ${this.state.confirmedScore.get("Aces") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("Aces") ? this.state.confirmedScore.get("Aces") : this.state.score.get("Aces") }</span>
            <span id="Twos"    onClick={this.handleClick} className={`${css.scoresheet_Twos} ${this.state.confirmedScore.get("Twos") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("Twos") ? this.state.confirmedScore.get("Twos") : this.state.score.get("Twos") }</span>
            <span id="Threes"  onClick={this.handleClick} className={`${css.scoresheet_Threes} ${this.state.confirmedScore.get("Threes") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("Threes") ? this.state.confirmedScore.get("Threes") : this.state.score.get("Threes") }</span>
            <span id="Fours"   onClick={this.handleClick} className={`${css.scoresheet_Fours} ${this.state.confirmedScore.get("Fours") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("Fours") ? this.state.confirmedScore.get("Fours") : this.state.score.get("Fours") }</span>
            <span id="Fives"   onClick={this.handleClick} className={`${css.scoresheet_Fives} ${this.state.confirmedScore.get("Fives") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("Fives") ? this.state.confirmedScore.get("Fives") : this.state.score.get("Fives") }</span>
            <span id="Sixes"   onClick={this.handleClick} className={`${css.scoresheet_Sixes} ${this.state.confirmedScore.get("Sixes") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("Sixes") ? this.state.confirmedScore.get("Sixes") : this.state.score.get("Sixes") }</span>
            <span className={`${css.scoresheet_TotalUpperNoBonus} ${this.state.confirmedScore.get("TotalUpperNoBonus") ? css.scoresheet_score_taken : ""}`}>{this.state.confirmedScore.get("TotalUpperNoBonus") ?? 0 }</span>
            <span className={`${css.scoresheet_Bonus} ${this.state.confirmedScore.get("Bonus") ? css.scoresheet_score_taken : ""}`}>{this.state.confirmedScore.get("Bonus") ?? 0 }</span>
            <span className={`${css.scoresheet_TotalScoreUpperSection} ${this.state.confirmedScore.get("TotalUpper") ? css.scoresheet_score_taken : ""}`}>{this.state.confirmedScore.get("TotalUpper") ?? 0 }</span> 
            <span id="ThreeOfAKind" onClick={this.handleClick} className={`${css.scoresheet_ThreeOfAKind} ${this.state.confirmedScore.get("ThreeOfAKind") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("ThreeOfAKind") ? this.state.confirmedScore.get("ThreeOfAKind") : this.state.score.get("ThreeOfAKind")}</span>
            <span id="FourOfAKind"  onClick={this.handleClick} className={`${css.scoresheet_FourOfAKind} ${this.state.confirmedScore.get("FourOfAKind") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("FourOfAKind") ? this.state.confirmedScore.get("FourOfAKind") : this.state.score.get("FourOfAKind")}</span>
            <span id="FullHouse"    onClick={this.handleClick} className={`${css.scoresheet_FullHouse} ${this.state.confirmedScore.get("FullHouse") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("FullHouse") ? this.state.confirmedScore.get("FullHouse") : this.state.score.get("FullHouse")}</span>
            <span id="SmStraight"   onClick={this.handleClick} className={`${css.scoresheet_SmStraight} ${this.state.confirmedScore.get("SmStraight") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("SmStraight") ? this.state.confirmedScore.get("SmStraight") : this.state.score.get("SmStraight")}</span>
            <span id="LgStraight"   onClick={this.handleClick} className={`${css.scoresheet_LgStraight} ${this.state.confirmedScore.get("LgStraight") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("LgStraight") ? this.state.confirmedScore.get("LgStraight") : this.state.score.get("LgStraight")}</span>
            <span id="Yahtzee"      onClick={this.handleClick} className={`${css.scoresheet_Yahtzee} ${this.state.confirmedScore.get("Yahtzee") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("Yahtzee") ? this.state.confirmedScore.get("Yahtzee") : this.state.score.get("Yahtzee")}</span>
            <span id="Chance"       onClick={this.handleClick} className={`${css.scoresheet_Chance} ${this.state.confirmedScore.get("Chance") ? css.scoresheet_score_taken : ""}`}>{ this.state.confirmedScore.get("Chance") ? this.state.confirmedScore.get("Chance") : this.state.score.get("Chance")}</span>
            <span className={`${css.scoresheet_TotalUpper} ${this.state.confirmedScore.get("TotalUpper") ? css.scoresheet_score_taken : ""}`}>{this.state.confirmedScore.get("TotalUpper") ?? 0 }</span> 
            <span className={`${css.scoresheet_TotalLower} ${this.state.confirmedScore.get("TotalLower") ? css.scoresheet_score_taken : ""}`}>{this.state.confirmedScore.get("TotalLower") ?? 0 }</span> 
            <span className={`${css.scoresheet_Total} ${this.state.confirmedScore.get("Total") ? css.scoresheet_score_taken : ""}`}>{this.state.confirmedScore.get("Total") ?? 0 }</span> 
          </div>
        </div>
      );
    }
}

export default ScoreSheet;