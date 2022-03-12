import { ACTIONS } from "./App";


export default function DigitButton({ dispatch, digit}) {
    return <button onClick={() => dispatch({ type : ACTIONS.ADD_DIGIT})}></button>
}