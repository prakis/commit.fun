import PropTypes from 'prop-types'
import _ from 'lodash'
import React, { Component } from 'react'
import { Search, Grid, Header, Segment, Label } from 'semantic-ui-react'
import { Markup } from 'interweave';

import gitdata from './gitdata.json';

console.log("----->", gitdata, "<-----");

const categoryLayoutRenderer = ({ categoryContent, resultsContent }) => (
    <Grid style={{ backgroundColor: 'yellow' }}>
        <Grid.Column>
            <div style={{ backgroundColor: 'green' }}>
                <h3 className='name'>{categoryContent}</h3>
                <div style={{ background: 'blue' }} className='results'>
                    {resultsContent}
                </div>
            </div>
        </Grid.Column>
    </Grid>
)

categoryLayoutRenderer.propTypes = {
    categoryContent: PropTypes.node,
    resultsContent: PropTypes.node
}

const categoryRenderer = ({ name }) => <Label as='span' content={name} />

categoryRenderer.propTypes = {
    name: PropTypes.string,
}

const resultRenderer = ({ title, description }) => <div >
    <Label content={title} />
    <br />
    <div>
        <Markup content={description} />
    </div>
</div>

resultRenderer.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
}

const initialState = { isLoading: false, results: [], value: '' }

const source = gitdata
console.log("------1------");
console.log(source);
console.log("------2------");
export default class SearchExampleCategory extends Component {
    state = initialState

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.setState(initialState)

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = (result) => re.test(result.filters)

            const filteredResults = _.reduce(
                source,
                (memo, data, name) => {
                    const results = _.filter(data.results, isMatch)
                    if (results.length) memo[name] = { name, results } // eslint-disable-line no-param-reassign

                    return memo
                },
                {},
            )
            console.log(value, "Results--------", filteredResults, "========");
            this.setState({
                isLoading: false,
                results: filteredResults,
            })
        }, 300)
    }

    render() {
        const { isLoading, value, results } = this.state

        return (
            <Grid>
                <Grid.Column width={10} style={{ backgroundColor: 'pink' }}>
                    <Search
                        fluid
                        showNoResults={false}
                        className={'active'}
                        open={true}
                        style={{ backgroundColor: 'red' }}
                        category
                        categoryLayoutRenderer={categoryLayoutRenderer}
                        categoryRenderer={categoryRenderer}
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, {
                            leading: true,
                        })}
                        resultRenderer={resultRenderer}
                        results={results}
                        value={value}
                        {...this.props}
                    />
                </Grid.Column>
                <Grid.Column width={6}>
                    <Segment>
                        <Header>State</Header>
                        <pre style={{ overflowX: 'auto' }}>
                            {JSON.stringify(this.state, null, 2)}
                        </pre>
                        <Header>Options</Header>
                        <pre style={{ overflowX: 'auto' }}>
                            {JSON.stringify(source, null, 2)}
                        </pre>
                    </Segment>
                </Grid.Column>
            </Grid>
        )
    }
}
