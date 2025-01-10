import React from "react";
import css from "../styles/ScoreSheet.module.css";

class ScoreSheet extends React.Component {
    
  constructor(props) {
      super(props);
      this.state = { confirmedScore: props.confirmedScoreArray };   
  }

  componentDidUpdate(prevProps) {  // handle updates from parent components
    
    if (!this.props.confirmedScoreArray || !this.props.scoreArray) {
      console.error("Score arrays are not provided or invalid.");
      return null; // Or render a fallback UI
    }

    if (prevProps.confirmedScoreArray !== this.props.confirmedScoreArray) {
      this.setState({ confirmedScore: this.props.confirmedScoreArray });
    }
  }

  handleClick = (el) => {
    if (this.props.lock) return //if the scoresheet is locked, just exit the function

    const newVal = new Map([...this.props.confirmedScoreArray])      
    newVal.set(el.target.id,parseInt(el.target.textContent))
    const recalculatedArray = this.calculateTotal(newVal)
    this.setState({
      confirmedScore: recalculatedArray
    }, () => { this.props.onChangeScore(this.state.confirmedScore) } //callback 
    );
  }

  calculateTotal = (mapScoreArray) => {
    //UPPER SECTION
    const Aces = mapScoreArray.get("Aces") ?? 0
    const Twos = mapScoreArray.get("Twos") ?? 0
    const Threes = mapScoreArray.get("Threes") ?? 0
    const Fours = mapScoreArray.get("Fours") ?? 0
    const Fives = mapScoreArray.get("Fives") ?? 0
    const Sixes = mapScoreArray.get("Sixes") ?? 0
    //
    const totalUpperNoBonus =   Aces + Twos + Threes + Fours + Fives + Sixes      
    mapScoreArray.set("TotalUpperNoBonus",totalUpperNoBonus)
    //Set bonus
    const bonus = (totalUpperNoBonus >= 63) ? 35 : 0      
    mapScoreArray.set("Bonus",bonus)
    //Set TotalUpper
    const totalUpper = parseInt(mapScoreArray.get("TotalUpperNoBonus")) + parseInt(mapScoreArray.get("Bonus"))
    mapScoreArray.set("TotalUpper",totalUpper)
    //LOWER SECTION
    const ThreeOfAKind = mapScoreArray.get("ThreeOfAKind") ?? 0
    const FourOfAKind = mapScoreArray.get("FourOfAKind") ?? 0
    const FullHouse = mapScoreArray.get("FullHouse") ?? 0
    const SmStraight = mapScoreArray.get("SmStraight") ?? 0
    const LgStraight = mapScoreArray.get("LgStraight") ?? 0
    const Yahtzee = mapScoreArray.get("Yahtzee") ?? 0
    const Chance = mapScoreArray.get("Chance") ?? 0
    //Set TotalLower
    const totalLower =   ThreeOfAKind + FourOfAKind + FullHouse + SmStraight + LgStraight + Yahtzee + Chance 
    mapScoreArray.set("TotalLower",totalLower)
    //Set Total
    mapScoreArray.set("Total",(totalUpper+totalLower))
    //
    return mapScoreArray
  }

  render() {      
    return (
      <div className={css.scoresheetWrapper}>
        <div className={css.scoresheet}>
          <span id="Aces"    onClick={this.handleClick} className={`${css.scoresheet_Aces}   ${isNaN(this.state.confirmedScore.get("Aces"))      ? "" :  css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("Aces")   ? this.state.confirmedScore.get("Aces") : this.props.scoreArray.get("Aces") }</span>
          <span id="Twos"    onClick={this.handleClick} className={`${css.scoresheet_Twos}   ${isNaN(this.state.confirmedScore.get("Twos"))      ? "" :  css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("Twos")   ? this.state.confirmedScore.get("Twos") : this.props.scoreArray.get("Twos") }</span>
          <span id="Threes"  onClick={this.handleClick} className={`${css.scoresheet_Threes} ${isNaN(this.state.confirmedScore.get("Threes"))    ? "" :  css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("Threes") ? this.state.confirmedScore.get("Threes") : this.props.scoreArray.get("Threes") }</span>
          <span id="Fours"   onClick={this.handleClick} className={`${css.scoresheet_Fours}  ${isNaN(this.state.confirmedScore.get("Fours"))     ? "" :  css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("Fours")  ? this.state.confirmedScore.get("Fours") : this.props.scoreArray.get("Fours") }</span>
          <span id="Fives"   onClick={this.handleClick} className={`${css.scoresheet_Fives}  ${isNaN(this.state.confirmedScore.get("Fives"))     ? "" :  css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("Fives")  ? this.state.confirmedScore.get("Fives") : this.props.scoreArray.get("Fives") }</span>
          <span id="Sixes"   onClick={this.handleClick} className={`${css.scoresheet_Sixes}  ${isNaN(this.state.confirmedScore.get("Sixes"))     ? "" :  css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("Sixes")  ? this.state.confirmedScore.get("Sixes") : this.props.scoreArray.get("Sixes") }</span>
          <span className={`${css.scoresheet_TotalUpperNoBonus}       ${css.total} ${isNaN(this.state.confirmedScore.get("TotalUpperNoBonus")) ? "" : css.scoresheet_score_taken}`}>{this.state.confirmedScore.get("TotalUpperNoBonus") ?? 0 }</span>
          <span className={`${css.scoresheet_Bonus}                   ${css.total} ${isNaN(this.state.confirmedScore.get("Bonus"))             ? "" : css.scoresheet_score_taken}`}>{this.state.confirmedScore.get("Bonus") ?? 0 }</span>
          <span className={`${css.scoresheet_TotalScoreUpperSection}  ${css.total} ${isNaN(this.state.confirmedScore.get("TotalUpper"))        ? "" : css.scoresheet_score_taken}`}>{this.state.confirmedScore.get("TotalUpper") ?? 0 }</span> 
          <span id="ThreeOfAKind" onClick={this.handleClick} className={`${css.scoresheet_ThreeOfAKind} ${isNaN(this.state.confirmedScore.get("ThreeOfAKind")) ? "" : css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("ThreeOfAKind") ? this.state.confirmedScore.get("ThreeOfAKind") : this.props.scoreArray.get("ThreeOfAKind")}</span>
          <span id="FourOfAKind"  onClick={this.handleClick} className={`${css.scoresheet_FourOfAKind}  ${isNaN(this.state.confirmedScore.get("FourOfAKind"))  ? "" : css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("FourOfAKind")  ? this.state.confirmedScore.get("FourOfAKind") : this.props.scoreArray.get("FourOfAKind")}</span>
          <span id="FullHouse"    onClick={this.handleClick} className={`${css.scoresheet_FullHouse}    ${isNaN(this.state.confirmedScore.get("FullHouse"))    ? "" : css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("FullHouse")    ? this.state.confirmedScore.get("FullHouse") : this.props.scoreArray.get("FullHouse")}</span>
          <span id="SmStraight"   onClick={this.handleClick} className={`${css.scoresheet_SmStraight}   ${isNaN(this.state.confirmedScore.get("SmStraight"))   ? "" : css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("SmStraight")   ? this.state.confirmedScore.get("SmStraight") : this.props.scoreArray.get("SmStraight")}</span>
          <span id="LgStraight"   onClick={this.handleClick} className={`${css.scoresheet_LgStraight}   ${isNaN(this.state.confirmedScore.get("LgStraight"))   ? "" : css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("LgStraight")   ? this.state.confirmedScore.get("LgStraight") : this.props.scoreArray.get("LgStraight")}</span>
          <span id="Yahtzee"      onClick={this.handleClick} className={`${css.scoresheet_Yahtzee}      ${isNaN(this.state.confirmedScore.get("Yahtzee"))      ? "" : css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("Yahtzee")      ? this.state.confirmedScore.get("Yahtzee") : this.props.scoreArray.get("Yahtzee")}</span>
          <span id="Chance"       onClick={this.handleClick} className={`${css.scoresheet_Chance}       ${isNaN(this.state.confirmedScore.get("Chance"))       ? "" : css.scoresheet_score_taken}`}>{ this.state.confirmedScore.get("Chance")       ? this.state.confirmedScore.get("Chance") : this.props.scoreArray.get("Chance")}</span>
          <span className={`${css.scoresheet_TotalUpper}  ${css.total} ${isNaN(this.state.confirmedScore.get("TotalUpper"))  ? "" : css.scoresheet_score_taken}`}>{this.state.confirmedScore.get("TotalUpper") ?? 0 }</span> 
          <span className={`${css.scoresheet_TotalLower}  ${css.total} ${isNaN(this.state.confirmedScore.get("TotalLower"))  ? "" : css.scoresheet_score_taken}`}>{this.state.confirmedScore.get("TotalLower") ?? 0 }</span> 
          <span className={`${css.scoresheet_Total}       ${css.total} ${isNaN(this.state.confirmedScore.get("Total"))       ? "" : css.scoresheet_score_taken}`}>{this.state.confirmedScore.get("Total")      ?? 0 }</span> 
        </div>
      </div>
    );
  }
}

export default ScoreSheet