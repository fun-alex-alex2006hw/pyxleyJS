
import {actions} from '../actions/index'
import {fetchData} from '../utils/fetch'
const receiveChartData = actions.receiveChartData;
const receiveChartDataError = actions.receiveChartDataError;
const receiveFilterData = actions.receiveFilterData;
const receiveFilterDataError = actions.receiveFilterDataError;
const selectFilterOption = actions.selectFilterOption;

function getChartData(params, dispatch, charts, prefix) {

    for(var i = 0; i < charts.length; i++){

        let id = prefix.concat(i)
        fetchData(
            charts[i].options.url,
            params,
            json => {dispatch(receiveChartData(id,json))},
            () => {dispatch(receiveChartDataError())}
        )
    }
}

function getFilterData(params, dispatch, filters) {

    for (let _filter in filters){

        filters[_filter].map( f => {

            if (("url" in f.options) && (f.options.alias !== undefined)){

                fetchData(
                    f.options.url,
                    params,
                    json => {
                        dispatch(
                            receiveFilterData(f.options.alias,json.data)
                        )
                    },
                    () => {dispatch(receiveFilterDataError())}
                )
            }
        })
    }
}

function updateLocation(alias, value){
    let url = document.location.hash;
    if(url.length > 1) {
        url = url.slice(1)
    }

    // split on ?
    let tokens = url.split("&")

    let query = ""
    let notFound = true
    let prefix = ""
    for (let i = 0; i < tokens.length; i++){
        if( tokens[i] !== "" ){
            // split on =
            let pairs = tokens[i].split("=")
            if(pairs[0] === alias){
                tokens[i] = pairs[0].concat("=", value)
                notFound = false
            }
            prefix = query === "" ? "" : "&"
            query = query.concat(prefix, tokens[i])
        }

    }
    if( notFound ){
        prefix = query === "" ? "" : "&"
        query = query.concat(prefix, alias, "=", value)
    }

    document.location.hash = query;
}

function updateFilterState(input, dispatch) {

    if(input.constructor === Array){
        input.map( t => {
            dispatch(selectFilterOption(t.alias, t.value))
        })
    }

}

function updateStateAndHash(input, dispatch) {

    if(input.constructor === Array){
        input.map( t => {
            dispatch(selectFilterOption(t.alias, t.value))
            updateLocation(t.alias, t.value)
        })
    }

}

const utils = {
    getChartData: getChartData,
    getFilterData: getFilterData,
    updateFilterState: updateFilterState,
    updateStateAndHash: updateStateAndHash
}

export {utils}