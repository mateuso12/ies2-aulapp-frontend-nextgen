/**
 * Barrel exports para componentes de tipos específicos de exercícios.
 *
 * Cada componente será implementado em seu próprio arquivo:
 * - MultipleChoiceExercise.tsx
 * - OpenTextExercise.tsx
 * - NumericExercise.tsx
 * - OrderingExercise.tsx
 * - TrueFalseExercise.tsx
 * - WritingExercise.tsx
 *
 * Cada componente deve:
 * 1. Receber props do tipo ExerciseComponentProps<TData, TAnswer>
 * 2. Implementar UI específica do tipo de exercício
 * 3. Chamar onChange quando a resposta mudar
 * 4. Mostrar feedback visual apropriado
 * 5. Respeitar os estados readonly, showCorrectAnswer, disabled
 */

// TODO: Implementar componentes individuais
// export { MultipleChoiceExercise } from './MultipleChoiceExercise'
// export { NumericExercise } from './NumericExercise'
// export { OrderingExercise } from './OrderingExercise'
// export { TrueFalseExercise } from './TrueFalseExercise'

export { MultipleChoiceExerciseComponent } from './MultipleChoiceExercise'
export { WritingExercise as WritingExerciseComponent } from './WritingExercise'
export { NumericExercise as NumericExerciseComponent } from './NumericExercise'
export { TrueFalseExerciseComponent } from './TrueFalseExercise'
export { OpenTextExerciseComponent } from './OpenTextExercise'
