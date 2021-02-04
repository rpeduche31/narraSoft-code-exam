/**
 * View component for /notes
 *
 * Generic note list view. Defaults to 'all' with:
 * this.props.dispatch(noteActions.fetchListIfNeeded());
 *
 * NOTE: See /product/views/ProductList.js.jsx for more examples
 */

// import primary libraries
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as noteActions from '../noteActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import NoteLayout from '../components/NoteLayout.js.jsx';
import NoteListItem from '../components/NoteListItem.js.jsx';
import CommentForm from '../components/CommentForm.js.jsx';
import { set } from 'lodash';

const NoteList = (props) => {
	const [commentLists, setCommentLists] = useState('');
	const [renderView, setRenderView] = useState(false);

	const getListOfNotes = () => {
		const testItem = props.dispatch(
			noteActions.fetchListIfNeeded('_task', props.match.params.taskId)
		);
		testItem
			.then((res) => {
				console.log(res, 'yowyowyow');
				setCommentLists(res.list);
				setRenderView(true);
			})
			.catch((err) => {
				setRenderView(true);
			});
	};

	useEffect(() => {
		getListOfNotes();
	}, []);

	const { noteStore } = props;
	const subNoteListItems = noteStore.util.getList(
		'_task',
		props.match.params.taskId
	);
	console.log(subNoteListItems, 'subNoteListItems');
	/**
	 * Retrieve the list information and the list items for the component here.
	 *
	 * NOTE: if the list is deeply nested and/or filtered, you'll want to handle
	 * these steps within the mapStoreToProps method prior to delivering the
	 * props to the component.  Othwerwise, the render() action gets convoluted
	 * and potentially severely bogged down.
	 */

	// get the noteList meta info here so we can reference 'isFetching'
	const noteList = noteStore.lists ? noteStore.lists.all : null;

	/**
	 * use the reducer getList utility to convert the all.items array of ids
	 * to the actual note objetcs
	 */
	const noteListItems = noteStore.util.getList('all');

	/**
	 * NOTE: isEmpty is is usefull when the component references more than one
	 * resource list.
	 */

	const isFetching = !noteListItems || !noteList || noteList.isFetching;

	const loadsNewComment = () => {
		props.dispatch(
			noteActions.fetchListIfNeeded('_task', props.match.params.taskId)
		);
		setRenderView(false);
		setCommentLists([]);
		setTimeout(() => {
			getListOfNotes();
		}, 500);
	};

	return (
		<div>
			<br />

			{renderView ? (
				commentLists && commentLists.length ? (
					<div style={{ opacity: isFetching ? 0.5 : 1 }}>
						{commentLists.map((note, i) => (
							<NoteListItem
								action={props.dispatch}
								key={note._id + i}
								note={note}
							/>
						))}
					</div>
				) : (
					<h2>Empty.</h2>
				)
			) : (
				<h2>....loading</h2>
			)}
			<hr />
			<CommentForm loadsNewComment={loadsNewComment} />
		</div>
	);
};

NoteList.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
	/**
	 * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
	 * differentiated from the React component's internal state
	 */
	return {
		testStore: store,
		noteStore: store.note,
		loggedInUser: store.user.loggedIn.user,
	};
};

export default withRouter(connect(mapStoreToProps)(NoteList));
