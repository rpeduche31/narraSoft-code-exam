// import primary libraries
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, history, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as flowActions from '../flowActions';
import * as taskActions from '../../task/taskActions';

const FlowListItem = (props) => {
	const { flow, action } = props;

	useEffect(() => {
		action(taskActions.fetchSingleIfNeeded(flow._id));
		action(taskActions.fetchListIfNeeded('_flow', flow._id));
	}, []);

	const taskListItems =
		props.taskStore && props.taskStore.util.getList('_flow', flow._id);

	const handleRouteTitle = () => {
		props.history.push(`flows/${flow._id}`);
	};

	return (
		<div className="flow-list-item">
			{/* <Link to={`/flows/${flow._id}`}> {flow.name}</Link> */}
			<div onClick={handleRouteTitle} className="flow-list-item-name">
				{flow.name}
			</div>
			<div className="list-item-holder">
				{taskListItems &&
					taskListItems.length > 0 &&
					taskListItems.map((items) => {
						return (
							<div className="list-item-checkbox">
								<input className="task-checkbox" type="checkbox" />
								{items.name ? items.name : ''}
							</div>
						);
					})}
			</div>
			<div></div>
		</div>
	);
};

FlowListItem.propTypes = {
	dispatch: PropTypes.func.isRequired,
	flow: PropTypes.object.isRequired,
};

const mapStoreToProps = (store) => {
	return {
		store: store,
		taskStore: store.task,
	};
};

export default withRouter(connect(mapStoreToProps)(FlowListItem));
