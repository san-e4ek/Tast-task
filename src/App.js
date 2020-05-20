import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default () => {
    const [state, setState] = useState({
        data: [],
        filteredData: [],
        isSort: true
    })

    useEffect(() => {
        axios.get('https://jsoneditoronline.herokuapp.com/v1/docs/a60440dc240e45afa65fa68a060af624')
            .then(response => JSON.parse(response.data.data))
            .then(data => setState({...state, data: [...data], filteredData: [...data]}))
    }, [])

    const onSearch = value => {
        const filteredData = state.data.filter(item => {
            return item.name.toLowerCase().includes(value.toLowerCase())
        })

        setState({...state, filteredData})
    }

    const onSort = to => {
        const sortedData = state.filteredData.sort((a, b) => {
            if (to === 'asc' && b.name > a.name) {
                return - 1
            }

            if (to === 'desc' && a.name > b.name) {
                return - 1
            }
        })
        setState({...state, isSort: !state.isSort, filteredData: sortedData})
    }

    return (
        <div className="wrapper">
            <input onChange={e => onSearch(e.target.value)} type="search" className="search" placeholder="&#128270;"/>

            <table className="table">
                <thead>
                <tr>
                    <th>
                        Tool name
                        {state.isSort
                            ? <span onClick={() => onSort('asc')}> (asc)</span>
                            : <span onClick={() => onSort('desc')}> (desc)</span>}
                    </th>
                    <th>Used on</th>
                    <th>Type</th>
                    <th>Status</th>
                </tr>
                </thead>

                <tbody>
                {
                    state.filteredData.map(item => (
                        <tr className="table-item" key={item.id}>
                            <td>{item.name}</td>
                            <td>
                                {
                                    item.sites === 0
                                        ? item.sites
                                        : item.sites === 1
                                        ? item.sites + ' site'
                                        : item.sites + ' sites'
                                }
                            </td>
                            <td>{item.type}</td>
                            <td>
                                <span style={
                                    item.status === 'enable'
                                        ? {background: '#51d7a3'}
                                        : item.status === 'disable'
                                        ? {background: 'grey'}
                                        : null
                                }>
                                {
                                    item.status === 'enable'
                                        ? 'on'
                                        : item.status === 'disable'
                                        ? 'off'
                                        : <span>&#128274;</span>
                                }
                                </span>
                            </td>
                        </tr>
                    ))
                }

                </tbody>
            </table>
        </div>
    )
}