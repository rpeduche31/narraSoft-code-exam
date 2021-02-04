/**
 * Reusable stateless form component for Note
 */

// import primary libraries
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history, withRouter } from 'react-router-dom';

// import third-party libraries
import _ from 'lodash';
// import form components

import * as noteActions from '../noteActions';

const CommentForm = (props) => {
	// set the button text

	const [note, setNote] = useState('');

	useEffect(() => {
		setNote(props.defaultNote.obj);
		const { dispatch } = props;
		dispatch(noteActions.fetchDefaultNote());
	}, []);

	useEffect(() => {
		setNote(_.cloneDeep(props.defaultNote.obj));
	}, [props.defaultNote.obj]);

	const _handleFormChange = (e) => {
		setNote({ ...note, [e.target.name]: e.target.value });
	};

	const _handleFormSubmit = (e) => {
		const { dispatch, history } = props;

		let submitNote = {
			...note,
			_flow: props.taskStore.byId[props.match.params.taskId],
			_user: props.loggedInUser._id,
			_name: {
				id: props.loggedInUser._id,
				firstName: props.loggedInUser.firstName,
				lastName: props.loggedInUser.lastName,
			},
			_task: props.match.params.taskId,
		};

		e.preventDefault();
		dispatch(noteActions.sendCreateNote(submitNote))
			.then((noteRes) => {
				if (noteRes.success) {
					dispatch(noteActions.invalidateList());
					props.loadsNewComment();
					location.reload(); // not good for reloading items
					setNote({ ...note, content: '' });
				} else {
					alert('ERROR - Check logs');
				}
			})
			.catch((err) => console.log(err, 'err'));
	};

	return (
		<div className="textarea-container">
			<form className="textarea-container" onSubmit={_handleFormSubmit}>
				<textarea
					name="content"
					onChange={_handleFormChange}
					className="textarea-comment-form"
					value={note && note.content}
				/>
				<button
					onClick={_handleFormSubmit}
					className="textarea-comment-form-button"
				>
					Add Comment
				</button>
			</form>
		</div>
	);
};

CommentForm.propTypes = {
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
		taskStore: store.task,
		noteStore: store.note,
		loggedInUser: store.user.loggedIn.user,
	};
};

export default withRouter(connect(mapStoreToProps)(CommentForm));
