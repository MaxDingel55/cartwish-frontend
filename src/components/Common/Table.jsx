import React from 'react'

import './Table.css'

// children is a special props that stores all the jsx of the parent component, CartPage
const Table = ({ headings, children }) => {
    return (
        <table className="common_table">
            <thead>
                <tr>
                    {headings.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
            </thead>
            
            {children} 
        </table>
    )
}

export default Table
