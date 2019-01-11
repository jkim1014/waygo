import React, { Component } from 'react'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete'
import { withRouter } from 'react-router-dom'
import { Wrapper } from './styles'
import Button from '@material-ui/core/Button'
import { GET_ITINERARIES } from '../Itinerary/graphql';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Query } from 'react-apollo';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      longitude: '',
      latitude: '',
      address: '',
      merchants: []
    }
  }
  handleChange = address => {
    this.setState({ address })
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({ latitude: latLng.lat })
        this.setState({ longitude: latLng.lng })
      })
      .catch(error => console.error('Error', error))
  }
  render() {
    return (
      <div>
        <Wrapper>
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Search Places ...',
                    className: 'location-search-input'
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map(suggestion => {
                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item'
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer' }
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <Button onClick={() => this.props.history.push({pathname: '/budget', state: this.state})}>Explore!</Button>
        </Wrapper>
        <Query query={GET_ITINERARIES}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading';
            if (error) return 'Error!';
            console.log(data);
            const itineraries = data.itinerary.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })

            return (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Num. Items</TableCell>
                    <TableCell>Budget</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itineraries.map(i => {
                    return(
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {i.name}
                        </TableCell>
                        <TableCell>{i.date}</TableCell>
                        <TableCell>{i.merchants.length}</TableCell>
                        <TableCell>{i.budget}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default withRouter(Home)
