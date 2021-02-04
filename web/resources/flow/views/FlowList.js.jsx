/**
 * View component for /flows
 *
 * Generic flow list view. Defaults to 'all' with:
 * this.props.dispatch(flowActions.fetchListIfNeeded());
 *
 * NOTE: See /product/views/ProductList.js.jsx for more examples
 */

// import primary libraries
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter, history } from 'react-router-dom';

// import actions
import * as flowActions from '../flowActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';
import HeaderWithButtonLayout from '../../../global/components/layouts/HeaderWithButtonLayout.js.jsx';

// import resource components
import FlowLayout from '../components/FlowLayout.js.jsx';
import FlowListItem from '../components/FlowListItem.js.jsx';

const FlowList = (props) => {
	useEffect(() => {
		props.dispatch(flowActions.fetchListIfNeeded('all'));
	}, []);

	const { flowStore, history } = props;
	const flowList = flowStore.lists ? flowStore.lists.all : null;
	const flowListItems = flowStore.util.getList('all');

	const isEmpty = !flowListItems || !flowList;

	const isFetching = !flowListItems || !flowList || flowList.isFetching;

	const handleAction = () => {
		history.push('flows/new');
	};

	return (
		<FlowLayout>
			<HeaderWithButtonLayout
				title={'Flows'}
				buttonTitle={'New Flow'}
				action={handleAction}
			/>

			<br />
			{isEmpty ? (
				isFetching ? (
					<h2>Loading...</h2>
				) : (
					<h2>Empty.</h2>
				)
			) : (
				<div className="flow-list-item-holder">
					{flowListItems.map((flow, i) => (
						<FlowListItem
							action={props.dispatch}
							history={history}
							key={flow._id + i}
							flow={flow}
						/>
					))}
				</div>
			)}
		</FlowLayout>
	);
};

FlowList.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
	/**
	 * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
	 * differentiated from the React component's internal state
	 */
	return {
		flowStore: store.flow,
		defaultTask: store.task.defaultItem,

		taskStore: store.task,
	};
};

export default withRouter(connect(mapStoreToProps)(FlowList));
