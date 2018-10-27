const Defaults = require('./../defaults');
jest.mock('react-native');
import { OneSignal } from './../onesignal'

test('OneSignal', () => {
   let onesignal : OneSignal;

   beforeEach(() => {
      onesignal = new OneSignal(Defaults.appId, {});
   });

   it('should add subscription observer', () => {
      onesignal.addSubscriptionObserver(stateChanges => {
         
      });
   });
});


test('basic', () => {
   expect(1).toEqual(1);
});