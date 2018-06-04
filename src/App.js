// React
import React, { Component } from 'react'
// Layout
import Header from './components/views/layout/Header'
import QuestionContainer from './components/views/layout/questionContainer'
import ResultModal from './components/views/layout/resultModal'

// Helpers

import PersonajeAfectado from './components/model/affectedCharacter'
import CalculatePositions from './components/model/calculatePositions'
import TransformName from './components/model/transformName'

// Servicios
import axios from 'axios'
// Estilos
import 'bulma/css/bulma.min.css'
import './App.css'
import 'animate.css/animate.min.css'

class Root extends Component {
  //! State
  state = {
    characterScore: { CL: 0, PB: 0, SS: 0, JS: 0, TL: 0, DT: 0 },
    characterResponses: { cr_0: {}, cr_1: {}, cr_2: {}, cr_3: {} },
    characterProfile: { initials: '', name: '', alias: '', bio: '', dixit: '' },
    questions: [],
    secuenceNum: 0,
    showModal: false,
    gameOver: false
  }

  // ! Lifecyle Hooks
  componentDidMount () {
    // ? Fetch all questions
    this.fetchQuestions()
    this.fetchCharacterResponses()
  }

  // ! Methods

  fetchQuestions = () => {
    const mongoLab = process.env.REACT_APP_APIKEY
    axios
      .get(
        `https://api.mlab.com/api/1/databases/testgot/collections/questions?apiKey=${mongoLab}`
      )
      .then(response => {
        const questions = response.data[0]
        this.setState({ questions })
      })
      .catch(e => console.log(e))
  }

  fetchCharacterResponses = () => {
    const mongoLab = process.env.REACT_APP_APIKEY
    axios
      .get(
        `https://api.mlab.com/api/1/databases/testgot/collections/character_responses?apiKey=${mongoLab}`
      )
      .then(response => {
        const characterResponses = response.data[0]
        this.setState({ characterResponses })
      })
      .catch(e => console.log(e))
  }

  computeAnswer = valueToCompute => {
    let QNum = this.state.secuenceNum
    // Identificar a qué personaje corresponde la pregunta
    let pj = PersonajeAfectado(QNum)
    // Copiar la tabla de posiciones de personajes en el actual estado de la app
    const characterScore = { ...this.state.characterScore }
    characterScore[pj] = Number(characterScore[pj]) + Number(valueToCompute)
    // Actualizar la tabla de posiciones de personajes
    this.setState({ characterScore })
    // Pasar el estado de la app a la siguiente pregunta
    QNum = QNum + 1
    this.setState({ secuenceNum: QNum })
  }

  fetchCharacterProfile (personajeGanador) {
    const mongoLab = process.env.REACT_APP_APIKEY
    axios
      .get(
        `https://api.mlab.com/api/1/databases/testgot/collections/character_profile?q={"initials":"${personajeGanador}"}&apiKey=${mongoLab}`
      )
      .then(response => {
        const characterProfile = response.data[0]
        this.setState({ characterProfile })
      })
      .catch(e => console.log(e))
  }

  finalPositions = () => {
    let posiciones = { ...this.state.characterScore }
    let posicionesFinal = CalculatePositions(posiciones)
    this.fetchCharacterProfile(posicionesFinal[5])
    const gameOver = { gameOver: true, showModal: true }
    this.setState({ gameOver })
    return `Sos ${TransformName(posicionesFinal[5])}. También te podemos decir que estás cerca de ${TransformName(posicionesFinal[4])} y lejos de ${TransformName(posicionesFinal[0])}.`
  }
  // ! Render

  render () {
    return (
      <div className='container has-background-black'>
        <Header />
        {!this.state.gameOver
          ? <QuestionContainer
            secuenceNum={this.state.secuenceNum}
            preguntas={this.state.questions}
            renderAnswer={this.state.renderAnswer}
            characterResponses={this.state.characterResponses}
            characterScore={this.state.characterScore}
            computeAnswer={this.computeAnswer}
            finalPositions={this.finalPositions}
            />
          : <ResultModal
            characterProfile={this.state.characterProfile}
            finalPositions={this.finalPositions}
            />}
      </div>
    )
  }
}

export default Root
