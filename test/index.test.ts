/**
 * @jest-environment jsdom
 */

 import { createEventDispatcher } from '../src/index'

 interface Props {
     onChangeStep: (evt: CustomEvent<string>) => void,
     onCancel: (evt: CustomEvent<string>) => void,
     onNullableEvent?: () => void
 }
 
 const step = { at: 'first' }
 
 const props: Props = {
   onChangeStep: evt => step.at = evt.detail,
   onCancel: evt => {
     evt.preventDefault()
     step.at= 'third'
   },
 }
 
 test('not preventing default, callack is present, it should return true', () => {
   expect(createEventDispatcher(props)('changeStep', 'second')).toBe(true)
 })
 
 test('check if callback was correctly executed', () => {
   expect(step.at).toBe('second')
 })
 
 test('there is no callback, should return true', () => {
   expect(createEventDispatcher(props)('nullableEvent')).toBe(true)
 })
 
 test('preventing default, callack is present, it should return false', () => {
   expect(createEventDispatcher(props)('cancel', 'third', true)).toBe(false)
 })
 
 test('check if callback was correctly executed after event.preventDefault()', () => {
   expect(step.at).toBe('third')
 })
 