import React, { Component } from 'react'
import Question from '../actions/Question'
import Answer from '../actions/Answer'
import ProgressBar from '../ui-elements/progressBar'
import OptionButton from '../ui-elements/optionButton'

class questionContainer extends Component {
  userAnswerHandler = e => {
    const valueToCompute = e.target.name
    this.props.computeAnswer(valueToCompute)
    const { secuenceNum } = this.props
    // Agregar un delay de entrada a la primer respuesta de una pregunta nueva
    if (secuenceNum === 5 || secuenceNum === 11 || secuenceNum === 17) {
      document.querySelector('.respuesta').style.visibility = 'hidden'
      setTimeout(() => {
        document.querySelector('.respuesta').style.visibility = 'visible'
        document.querySelector('.respuesta').classList.remove('fadeIn')
        document.querySelector('.respuesta').classList.add('fadeInRight')
      }, 600)
    }

    // Agregar clase de fadeIn en la respuesta y removerla
    if (secuenceNum < 25) {
      document.querySelector('.respuesta').classList.remove('fadeInRight')
      document.querySelector('.respuesta').classList.add('fadeIn')
      if (secuenceNum < 25) {
        window.setTimeout(() => {
          if (document.querySelector('.respuesta') !== null) {
            document.querySelector('.respuesta').classList.remove('fadeIn')
          }
        }, 1000)
      }
    }
  }

  render () {
    return (
      <section id='secondScreen' className='hero is-fullheight'>
        <div className='hero-body'>
          <div className='container QA'>
            <Question
              secuenceNum={this.props.secuenceNum}
              preguntas={this.props.preguntas}
              finalPositions={this.props.finalPositions}
            />
            <Answer
              characterResponses={this.props.characterResponses}
              answerNumRender={this.props.secuenceNum}
              startAnswerAnimation={this.props.startAnswerAnimation}
            />
            <div className='container buttonPanel has-text-centered m-t-32'>
              <OptionButton name='-3' onClick={this.userAnswerHandler}>
                MUY EN DESACUERDO
              </OptionButton>
              <OptionButton name='-1' onClick={this.userAnswerHandler}>
                DESACUERDO
              </OptionButton>
              <OptionButton name='1' onClick={this.userAnswerHandler}>
                DE ACUERDO
              </OptionButton>
              <OptionButton name='3' onClick={this.userAnswerHandler}>
                MUY DE ACUERDO
              </OptionButton>
            </div>
            <div className=' progressContainer'>
              <ProgressBar
                value={this.props.secuenceNum}
                max={this.props.totalSecuence}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default questionContainer
