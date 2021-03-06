import Immutable from 'immutable'
import React from 'react'
import styles from './facet.css'
import _ from 'lodash'
import Collapse, { Panel } from 'rc-collapse'

class FacetList extends React.Component {
  constructor(props) {
    super(props)
    this.updateStoreAndSubmitSearch = this.updateStoreAndSubmitSearch.bind(this)
    this.facetMap = props.facetMap
    this.selectedFacets = props.selectedFacets
    this.modifySelectedFacets = props.modifySelectedFacets
    this.submit = props.submit
    this.state = this.getDefaultState()
  }

  getDefaultState() {
    return {
      terms : {
        "science": "Data Theme"
      }
    }
  }

  componentWillUpdate(nextProps) {
    this.facetMap = nextProps.facetMap
    this.selectedFacets = nextProps.selectedFacets
  }

  updateStoreAndSubmitSearch(e) {
    const {name, value} = e.target.dataset
    const selected = e.target.checked

    if (selected){
      this.selectedFacets = this.selectedFacets.setIn([name,value,'selected'], selected)
    } else {
      this.selectedFacets = this.selectedFacets.deleteIn([name,value]).filter(x => x.size)
    }

    this.modifySelectedFacets(this.selectedFacets)
    this.submit()
  }

  toTitleCase(str){
    return _.startCase(_.toLower((str.split(/(?=[A-Z])/).join(" "))))
  }

  subFacetLabel(str) {
    return str.split('>').pop().trim()
  }

  render() {
    let facets = []
    let self = this
    _.forOwn(this.facetMap, (terms,category) => {
      if (!_.isEmpty(terms)) { // Don't load categories that have no results
        facets.push(
          <Panel header={`${this.state.terms[category.toLowerCase()] ||
            self.toTitleCase(category)}`} key={`${category}`}>
            {Object.keys(terms).map( term => {
              let input = {
                className: styles.checkFacet,
                'data-name': category,
                'data-value': term,
                id: `${category}-${term}`,
                type: 'checkbox',
                onChange: self.updateStoreAndSubmitSearch,
                checked: terms[term].selected
              }
              return(<div key={`${category}-${term}`}>
                <input {...input}/>
                 <span className={styles.facetLabel}>{self.subFacetLabel(`${term}`)}</span>
                <div className={`${styles.count} ${styles.numberCircle}`}>{`(${terms[term].count})`}</div>
              </div>)
            })}
          </Panel>
        )
      }
    })

    return <div>
      <div className={`${styles.facetContainer}`}>
        <form className={`pure-form ${styles.formStyle}`}>
          <span className={'pure-menu-heading'}>Categories</span>
          <Collapse defaultActiveKey="0">
            {facets}
          </Collapse>
        </form>
      </div>
    </div>
  }

}
export default FacetList
