import React, { useState } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [questionAnswerText, setQuestionAnswerText] = useState('')
  const [cardsList, setCardsList] = useState(null)
  const [cards, setCards] = useState(cardsList)

  const apiKey = ' ' // api code
  const model = 'text-davinci-003'

  // credit to flashcard code from https://nabendu82.medium.com/build-a-flashcard-quiz-with-react-c1cb96e3a1e8 by Nabendu Biswas
  const FlashcardList = ({ flashcards }) => {
    return (
      <div className="card-grid">
        {flashcards.map(flashcard => {
          return <Flashcard flashcard={flashcard} key={flashcard.id} />
        })}
      </div>
    )
  }

  const Flashcard = ({ flashcard }) => {
    const [flip, setFlip] = useState(false)

    return (
      <div className={`card ${flip ? 'flip' : ""}`} onClick={() => { setFlip(!flip); console.log(flip, "aaaaaaaaa") }}>

        {flip ? flashcard.answer : flashcard.question}
      </div>
    )
  }


  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const askChatGpt = async (prompt) => {
    console.log(prompt)

    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt,
          model,
          max_tokens: 1000
        })
      });
      const data = await response.json();
      console.log(data)

      return data.choices[0].text
    } catch (error) {
      console.log('Error', error);
    }
    return null
  }


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let newinput = "'" + inputText + "' break this down into question and answers"

    let questionAnswerOutput = await askChatGpt(newinput)
    console.log(questionAnswerOutput)

    setQuestionAnswerText(questionAnswerOutput)
    let text = questionAnswerOutput
    let cardsText = text.split('Q: ')

    let cardsInfo = []
    let counter = 0
    cardsText.forEach(cardText => {
      let cardInfo = {
        id: counter,
        question: cardText.split('A: ')[0],
        answer: cardText.split('A: ')[1]
      }
      counter += 1
      cardsInfo.push(cardInfo)
    })

    setCardsList(cardsInfo)

  };


  return (
    <div className="App">
      <form onSubmit={handleFormSubmit}>
        <input type="text" value={inputText} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
      <br />
      {cardsList && <FlashcardList flashcards={cardsList} />
        //     <ul>
        //       {cardsList.map((card) => [
        //         <div key={card.id}>

        //           <p>{card.question}</p>
        //           <p> answer: {card.answer}</p>
        //         </div>
        //       ])}
        //     </ul>
      }
    </div>
  );
}

export default App;
