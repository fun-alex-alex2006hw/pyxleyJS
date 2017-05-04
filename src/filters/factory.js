import React from 'react';
import {connect} from 'react-redux';
import {SelectButton} from './SelectButton';
import {ConditionalSelectButton} from './ConditionalSelectButton';
import {ApiButton} from './ApiButton';
import {DownloadButton} from './DownloadButton';
import {SliderInput} from './SliderInput';
import {DynamicSearchInput} from './DynamicSearchInput';
import {CheckboxGroup} from './CheckboxGroup';
import {ReactSelect} from './ReactSelect';
import {InputDecimal} from './SimpleInput';
import {AntSelect, AntMultiSelect} from './AntSelect';

var FilterFactory = function(type) {
    if (typeof FilterFactory[type] != 'function'){
        throw new Error(type + ' is not a valid filter.');
    }

    return FilterFactory[type];
};

FilterFactory.SliderInput = SliderInput;
FilterFactory.SelectButton = AntSelect;
// FilterFactory.ConditionalSelectButton = ConditionalSelectButton;
// FilterFactory.ApiButton = ApiButton;
FilterFactory.DownloadButton = DownloadButton;
// FilterFactory.DynamicSearch = DynamicSearchInput;
// FilterFactory.CheckboxGroup = CheckboxGroup;
FilterFactory.ReactSelect = AntMultiSelect;
FilterFactory.MultiSelect = AntMultiSelect;
FilterFactory.SimpleInput = InputDecimal;

class Filter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var Z = this.props.filter_factory(this.props.type);

        return (
            <Z
                id={this.props.id}
                onChange={this.props.onChange}
                value={this.props.value}
                items={this.props.items}
                options={this.props.options} />
        );
    }
}

Filter.defaultProps = {
    filter_factory: FilterFactory
};


function mapFilterStateToProps(state, ownProps) {

    let output = {value: null, items: []}
    let id = ownProps.options.alias
    if( id in state.filters){
        if ("value" in state.filters[id]) {
            output.value = state.filters[id].value
        }
    }

    if( id in state.filter_data ){

        if ("data" in state.filter_data[id]) {
            output.options = ownProps.options
            output.items = state.filter_data[id].data
        }
    }

    return output
}
Filter = connect(mapFilterStateToProps)(Filter);
export {Filter, FilterFactory, mapFilterStateToProps}
