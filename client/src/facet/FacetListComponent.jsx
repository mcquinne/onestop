import React from 'react'
import styles from './facet.css'

class FacetList extends React.Component {
  constructor(props) {
    super(props)
    this.submit = props.submit
    this.updateQuery = props.updateQuery
    this.state = {}
  }

  search(query) {
    this.updateQuery(query);
    this.submit(query);
  }

  render() {
    let brandFacets = [
      {
        label: "Science",
        path: "/api/science",
        count: 0
      },
      {
        label: "Platform",
        path: "/api/platform",
        count: 0
      },
      {
        label: "Instrument",
        path: "/api/instrument",
        count: 0
      },
      {
        label: "Location",
        path: "/api/location",
        count: 0
      },
      {
        label: "Project",
        path: "/api/project",
        count: 0
      }
    ]

    brandFacets = brandFacets.map((facet, i) => {
      return <div key={i} className={styles.facetItem} onChange={()=>console.log("facets")}>
        <span className={`pure-menu-heading`}>Facets</span>
        <ul className={`pure-menu-list`}>
          <li className={`pure-menu-item`}>{facet.label}</li>
        </ul>
        {console.log(facet)}
      </div>
    })

    return <div>
      <div className={`${styles.facetContainer}`}>
        <h2> Facet: </h2>
        {brandFacets}
      </div>
    </div>
  }

}
export default FacetList
