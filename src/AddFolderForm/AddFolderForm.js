import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import PropTypes from 'prop-types';

class AddFolderForm extends React.Component {
  static contextType = ApiContext;

  state = {
    name: '',
    nameError: null
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { API_ENDPOINT } = config;
    const { name } = this.state;

    this.setState({ nameError: null });
    if (!name || name.trim() === '') {
      return this.setState({ nameError: 'Must enter a valid name' });
    }

    fetch(`${API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          nameError: null
        });
        this.context.addFolder(data);
        this.context = { ...this.context.folders, data };
        return this.props.history.push('/');
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        <h1>Add Folder</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
          {this.state.nameError ? <p>{this.state.nameError}</p> : null}
          <div>
            <button type='button' onClick={this.props.history.goBack}>
              Cancel
            </button>
            <button type='submit'>Create Folder</button>
          </div>
        </form>
      </div>
    );
  }
}

AddFolderForm.propTypes = {
  history: PropTypes.object.isRequired
};

export default AddFolderForm;
