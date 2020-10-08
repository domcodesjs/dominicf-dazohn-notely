import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import PropTypes from 'prop-types';

class AddNoteForm extends React.Component {
  static contextType = ApiContext;

  state = {
    name: '',
    content: '',
    folderId: '',
    nameError: null,
    contentError: null,
    folderIdError: null
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { API_ENDPOINT } = config;
    const { name, content, folderId } = this.state;

    this.setState({ nameError: null });
    if (!name || name.trim() === '') {
      return this.setState({ nameError: 'Must enter a valid name' });
    }

    this.setState({ contentError: null });
    if (!content || content.trim() === '') {
      return this.setState({ contentError: 'Must enter a valid content' });
    }

    this.setState({ folderIdError: null });
    if (!folderId || folderId.trim() === '') {
      return this.setState({ folderIdError: 'Must enter a valid folder' });
    }

    fetch(`${API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, content, folderId, modified: new Date() })
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          nameError: null,
          contentError: null,
          folderIdError: null
        });
        this.context.addNote(data);
        this.context = { ...this.context.notes, data };
        return this.props.history.push('/');
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { folders } = this.context;

    return (
      <div>
        <h1>Add Note</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
          {this.state.nameError ? <p>{this.state.nameError}</p> : null}
          <label htmlFor='content'>Content</label>
          <textarea
            id='content'
            value={this.state.content}
            onChange={(e) => this.setState({ content: e.target.value })}
          />
          {this.state.contentError ? <p>{this.state.contentError}</p> : null}
          <select
            defaultValue={''}
            onChange={(e) =>
              this.setState({
                folderId: e.target.value
              })
            }
          >
            <option disabled value={''} />
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          {this.state.folderIdError ? <p>{this.state.folderIdError}</p> : null}
          <div>
            <button type='button' onClick={this.props.history.goBack}>
              Cancel
            </button>
            <button type='submit'>Create Note</button>
          </div>
        </form>
      </div>
    );
  }
}

AddNoteForm.propTypes = {
  history: PropTypes.object.isRequired
};

export default AddNoteForm;
