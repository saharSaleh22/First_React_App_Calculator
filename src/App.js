import logo from './logo.svg';
import './App.css';
import './styles.css'
import { useReducer } from 'react';
import OperationButton from './OperationButton';
import DigitButton from './DigitButton';
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  CHOOSE_OPERATION: 'chhose-operation',
  DELETE_DIGIT: 'delete-digit',
  Evaluate: 'evaluate'

}
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.Evaluate:
      if(state.operation==null||state.current==null||state.previous==null)
      {return state}
      return{
        ...state,
        previous:null,
        overwrite:true,
        current:evaluate(state),
        operation:null
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite)return{
        ...state,
        overwrite:false,
        current:null,

      }
      if(state.current==null)return state
      if(state.current.length===1){
        return{...state,current:null}
      }
      return{
        ...state,
        current:state.current.slice(0,-1)
      }

    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          current:payload.digit,
          overwrite:false
        }
      }
      if (payload.digit === "0" && state.current === "0") return state
      if (payload.digit === "." && state.current.includes(".")) return state
      return {
        ...state,
        current: `${state.current || ""}${payload.digit}`,
      }
    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.CHOOSE_OPERATION:
      if (state.current == null && state.previous == null) {
        return state
      }
      if (state.previous == null) {
        return {
          ...state,
          operation: payload.operation,
          previous: state.current,
          current: null,

        }
      }
      if(state.current==null){
        return{
          ...state,
          operation:payload.operation,
        }
      }
      return {
        ...state,
        previous: evaluate(state),
        current: null,
        operation: payload.operation
      }

  }


}
function evaluate({current,previous,operation}) {
  const prev=parseFloat(previous)
  const curr=parseFloat(current)
  if(isNaN(prev)||isNaN(curr))return""
  let computation=""
  switch (operation){
    case "+":
      computation=prev+curr
      break
    case "-":
      computation=prev-curr
      break
    case "*":
      computation=prev*curr
      break
    case "/":
      computation=prev/curr
      break
  }
  return computation.toString()
 
}
const INTEGER_FORMATER=new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})
function formatOperand(operand){
  if(operand==null)return
  const[integer,decimal]=operand.split('.')
  if(decimal==null)return INTEGER_FORMATER.format(integer)
  return`${INTEGER_FORMATER.format(integer)}.${decimal}`
}
function App() {
  const [{ current, previous, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calc-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previous)} {operation}</div>
        <div className="current-operand">{formatOperand(current)}</div>
      </div>
      <button className="span2" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation={"/"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />
      <OperationButton operation={"*"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />
      <OperationButton operation={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />
      <OperationButton operation={"-"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />
      <button className="span2" onClick={() => dispatch({ type: ACTIONS.Evaluate })}>=</button>
    </div>

  )
}

export default App;
