/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as taskActions from '../taskActions';

// import global components

import HeaderWithButtonLayout from '../../../global/components/layouts/HeaderWithButtonLayout.js.jsx';

// import resource components
import TaskLayout from '../components/TaskLayout.js.jsx';
import NoteList from '../../note/views/NoteList.js.jsx';

const SingleTask = (props) => {
	useEffect(() => {
		const { dispatch, match } = props;
		dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
	}, []);

	const { taskStore } = props;

	/**
	 * use the selected.getItem() utility to pull the actual task object from the map
	 */
	const selectedTask = taskStore.selected.getItem();

	const isEmpty =
		!selectedTask || !selectedTask._id || taskStore.selected.didInvalidate;

	const isFetching = taskStore.selected.isFetching;

	const handleAction = () => {
		props.history.push(`${props.match.url}/update`);
	};

	return (
		<TaskLayout>
			{isEmpty ? (
				isFetching ? (
					<h2>Loading...</h2>
				) : (
					<h2>Empty.</h2>
				)
			) : (
				<HeaderWithButtonLayout
					title={selectedTask.name}
					description={selectedTask.description}
					buttonTitle={'Edit'}
					withBackOptions={true}
					backOption={'task'}
					backOptionAction={() => props.history.goBack()}
					action={handleAction}
				/>
			)}
			<hr />
			<NoteList />
		</TaskLayout>
	);
};

SingleTask.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
	/**
	 * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
	 * differentiated from the React component's internal state
	 */
	return {
		taskStore: store.task,
	};
};

export default withRouter(connect(mapStoreToProps)(SingleTask));
