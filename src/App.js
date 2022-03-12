import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css"

export const ACTIONS = {
    ADD_DIGIT: "add-digit",
    CHOOSE_OPERATION: "choose-operation",
    CLEAR: "clear",
    DELETE_DIGIT: "delete-digit",
    EVALUATE: "evaluate",
  }

  function reducer(state, { type, payload }) {
    switch (type) {
      case ACTIONS.ADD_DIGIT:
          // to overwrite the digit after the result when click another digit without this it will be concatinated
          if (state.overwrite) {
              return {
                  ...state,
                  currentOperand: payload.digit,
                  overwrite: false,
              }
          }
          // to add just one 0 because adding more than one it doesn't make any sense
          if (payload.digit === "0" && state.currentOperand=== "0"){ 
            return state
          }
          // to add just one . (121.154.215 to stop this exemple)
          if (payload.digit === "." && state.currentOperand.includes(".")){ 
            return state
          }
          return {
            ...state, 
            currentOperand:`${state.currentOperand || ""}${payload.digit}`,
          }
      case ACTIONS.CHOOSE_OPERATION:
          if (state.currentOperand == null && state.previousOperand == null){
            return state
          }
          if (state.previousOperand == null) {
              return {
                  ...state,
                  operation: payload.operation,
                  previousOperand: state.currentOperand,
                  currentOperand: null,
              }
          }

          return {
              ...state,
              previousOperand: evaluate(state),
              operation: payload.operation,
              currentOperand: null
          }
      case ACTIONS.EVALUATE:
          if (
              state.operation == null ||
              state.currentOperand == null ||
              state.previousOperand == null
          ){
              return state
          }

          return {
            ...state,
            previousOperand: null,
            operation: null,
            overwrite:true,
            currentOperand: evaluate(state)
        }
      case ACTIONS.DELETE_DIGIT:
          if (state.overwrite){
              return {
                ...state,
                overwrite: false,
                currentOperand: null
              }
          }
          if (state.currentOperand == null) return state
          if (state.currentOperand.length === 1) {
              return { ...state, currentOperand: null}
          }

          return {
            ...state,
            currentOperand: state.currentOperand.slice(0,-1)
        }
      case ACTIONS.CLEAR:
          return {}

    }
  }

  function evaluate({ currentOperand, previousOperand, operation }) {
    // convert currentOperand and previousOperand to numbers with parseFloat
    const prev = parseFloat(previousOperand) 
    const current = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(current)) return ""
    let computation = ""
    switch (operation) {
      case "+":
        computation = prev + current
        break
      case "-":
        computation = prev - current
        break
      case "*":
        computation = prev * current
        break
      case "/":
        computation = prev / current
        break
    }
  
    return computation.toString()
  }

  //formatting the entire number with ',' separator
  const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
  })
  //separate the decimal to can do : (exp 12.002) 
  //and do not do any formatter to the decimal part (exp 77,777.5555555559)
  function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split(".")
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
  }

function App() {
    const [{ currentOperand, previousOperand, operation }, dispatch]= useReducer(
        reducer, 
        {}
    )

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
