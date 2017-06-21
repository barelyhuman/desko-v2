import React from "react";
import Card from "./card.js";

export default function CardContainer(props) {
  var cards = props.cards;
  console.log(cards);
  cards = cards.map(item =>
    <div key={item.id}>
      <Card modalStateHandler={props.modalStateHandler} cardInfo={item} />
      <hr />
    </div>
  );
  return (
    <div className="card-container">
      {cards}
    </div>
  );
}
