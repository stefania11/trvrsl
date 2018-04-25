// @flow
import React from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'react-emotion'
import { compose, pure, withHandlers, withStateHandlers } from 'recompose'
import { FORMS } from '../constants/en'
import assignMarkdownHeadings from '../lib/assignMarkdownHeadings'
import InputControl from '../blocks/InputControl'
import Article from '../elements/Article'
import BaseSection from '../elements/Section'
import Form from '../elements/Form'
import Paragraph from '../elements/Paragraph'
import PillLink from '../elements/PillLink'
import Title from '../elements/Title'

const Section = styled(BaseSection)({
  color: '#fff',
  backgroundImage: 'linear-gradient(-180deg, #FF0092 1%, #D800FF 100%)',
})

const components = ({
  heading: props => assignMarkdownHeadings(props, [Title]),
  paragraph: Paragraph,
  root: Article,
})

const Actions = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
})

const PillButton = PillLink.withComponent('button')

// -------------------------------------

type Props = {
  emailAddress: string,
  isFormValid: boolean,
  fullName: string,
  handleChange: (e: SyntheticInputEvent<*>) => void,
  handleSubmit: (e: SyntheticInputEvent<*>) => void,
  question: string,
  source: string,
}

let formElement = null
const formAction = '/contact'
const initialState = {
  emailAddress: '',
  fullName: '',
  isFormValid: false,
  question: '',
}

const selectForm = () => {
  if (typeof document === 'undefined') { return null }
  if (formElement === null) {
    formElement = document.body && document.body.querySelector(`form[action="${formAction}"]`)
  }
  return formElement
}

const getIsFormValid = () => {
  const form = selectForm()
  // $FlowFixMe - Flow thinks `form` is an `HTMLElement` instead of `HTMLFormElement`
  return form != null ? form.checkValidity() : false
}

const withStateUpdates = withStateHandlers(
  () => (initialState),
  {
    handleChange: () => e => ({
      [e.target.name]: e.target.value,
      isFormValid: getIsFormValid(),
    }),
  },
)

const withEventHandlers = withHandlers({
  handleSubmit: props => (e) => {
    e.preventDefault()
    // eslint-disable-next-line no-console
    console.log('handleSubmit', props)
  },
})

const Contact = (props: Props) => (
  <Section id="contact">
    <ReactMarkdown
      renderers={components}
      source={props.source}
    />
    <Form
      acceptCharset="UTF-8"
      action={formAction}
      css={{ marginTop: '4rem' }}
      method="POST"
      onSubmit={props.handleSubmit}
    >
      <InputControl
        isRequired
        handleChange={props.handleChange}
        label={FORMS.EMAIL_LABEL}
        name="emailAddress"
        type="email"
        placeholder={FORMS.EMAIL_PLACEHOLDER}
        value={props.emailAddress}
      />
      <InputControl
        handleChange={props.handleChange}
        label={FORMS.NAME_LABEL}
        name="fullName"
        placeholder={FORMS.NAME_PLACEHOLDER}
        value={props.fullName}
      />
      <InputControl
        handleChange={props.handleChange}
        label={FORMS.QUESTION_LABEL}
        name="question"
        placeholder={FORMS.QUESTION_PLACEHOLDER}
        value={props.question}
      />
      <Actions>
        <PillButton
          css={{
            '.no-touch &:hover': {
              backgroundColor: '#0091ff',
            },
          }}
          disabled={!props.isFormValid}
          onClick={props.handleSubmit}
        >
          {FORMS.SUBMIT_BUTTON_TEXT}
        </PillButton>
      </Actions>
    </Form>
  </Section>
)

export default compose(withStateUpdates, withEventHandlers, pure)(Contact)
