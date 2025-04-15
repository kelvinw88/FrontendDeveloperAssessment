import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useRiskData from './useRiskData';
import * as api from '../services/api';
import * as riskActions from '../features/riskSlice';

const mockStore = configureStore({
  middleware: [thunk],
});


describe('useRiskData hook', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      risk: {
        loadingRiskData: false,
        loadingIncidents: false,
        loadingHistoricalData: false,
        loadingEsgCategories: false,
        loadingSeverityLevels: false,
        loadingCriticalIncidents: false,
        errorRiskData: null,
        errorIncidents: null,
        errorHistoricalData: null,
        errorEsgCategories: null,
        errorSeverityLevels: null,
        errorCriticalIncidents: null,
      },
    });
  });

  it('should dispatch actions and return correct loading/error states on fetchRiskData success', async () => {
    const mockData = { riskScore: 100 };
    jest.spyOn(api, 'fetchRiskData').mockResolvedValue(mockData);
    const spySetRiskData = jest.spyOn(riskActions, 'setRiskData');

    const wrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;
    renderHook(() => useRiskData(), { wrapper });

    await new Promise(resolve => setTimeout(resolve, 0));

    const actions = store.getActions();
    expect(actions).toContainEqual(riskActions.setLoadingRiskData());
    expect(spySetRiskData).toHaveBeenCalledWith({ ...mockData, loadingRiskData: false });
  });

  it('should dispatch error action on fetchRiskData failure', async () => {
    jest.spyOn(api, 'fetchRiskData').mockRejectedValue(new Error('Fetch failed'));
    const spySetError = jest.spyOn(riskActions, 'setErrorRiskData');

    const wrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;
    renderHook(() => useRiskData(), { wrapper });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(spySetError).toHaveBeenCalledWith('Fetch failed');
  });
});
