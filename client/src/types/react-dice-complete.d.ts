declare module 'react-dice-complete' {
    interface IReactDiceProps {
        defaultRoll?: number,
        dieSize?: number,
        disableIndividual?: bool,
        dotColor?: string,
        faceColor?: string,
        margin?: number,
        numDice?: number,
        outline?: bool,
        outlineColor?: string,
        rollDone?: (param: any) => void,
        rollTime?: number,
        sides?: number,
    }

    declare const Dices: React.SFC<IReactDiceProps>
    export default Dices;
}