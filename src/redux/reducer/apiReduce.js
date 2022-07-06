import { GET_DATA } from '../../constants/types';

const INITIAL_STATE = {
    csvDataList: [],
    status: ''

};

const apiReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_DATA:
            return { ...state, csvDataList: action.payload, status: action.status }

        default:
            return state
    }
};
export default apiReducer