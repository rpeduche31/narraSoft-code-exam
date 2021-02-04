/**
 * View component for /notes/new
 *
 * Creates a new note from a copy of the defaultItem in the note reducer
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history, withRouter } from 'react-router-dom';

// import third-party libraries
import _ from 'lodash';

// import actions
import * as noteActions from '../noteActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import NoteForm from '../components/NoteForm.js.jsx';
import NoteLayout from '../components/NoteLayout.js.jsx';

class CreateNote extends Binder {
	constructor(props) {
		super(props);
		this.state = {
			note: _.cloneDeep(this.props.defaultNote.obj),
			// NOTE: We don't want to actually change the store's defaultItem, just use a copy
			formHelpers: {},
			/**
			 * NOTE: formHelpers are useful for things like radio controls and other
			 * things that manipulate the form, but don't directly effect the state of
			 * the note
			 */
		};
		this._bind('_handleFormChange', '_handleFormSubmit');
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(noteActions.fetchDefaultNote());
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			note: _.cloneDeep(nextProps.defaultNote.obj),
		});
	}
	_handleFormChange(e) {
		/**
		 * This let's us change arbitrarily nested objects with one pass
		 */
		let newState = _.update(this.state, e.target.name, () => {
			return e.target.value;
		});
		this.setState({ newState });
	}

	_handleFormSubmit(e) {
		const { dispatch, history } = this.props;
		e.preventDefault();
		dispatch(noteActions.sendCreateNote(this.state.note)).then((noteRes) => {
			if (noteRes.success) {
				dispatch(noteActions.invalidateList());
				history.push(`/notes/${noteRes.item._id}`);
			} else {
				alert('ERROR - Check logs');
			}
		});
	}

	render() {
		const { note, formHelpers } = this.state;
		const isEmpty =
			!note ||
			(note.name && note.name === null) ||
			(note.name && note.name === undefined);
		return (
			<NoteLayout>
				{/* { isEmpty ?
          <h2> Loading...</h2>
          : */}
				<NoteForm
					note={note}
					cancelLink="/notes"
					formHelpers={formHelpers}
					formTitle="Create Note"
					formType="create"
					handleFormChange={this._handleFormChange}
					handleFormSubmit={this._handleFormSubmit}
				/>
				{/* } */}
			</NoteLayout>
		);
	}
}

CreateNote.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
	/**
	 * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
	 * differentiated from the React component's internal state
	 */

	// manipulate store items here

	return {
		defaultNote: store.note.defaultItem,
	};
};

export default withRouter(connect(mapStoreToProps)(CreateNote));
