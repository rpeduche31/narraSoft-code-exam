import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as flowActions from '../flowActions';
import * as taskActions from '../../task/taskActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';
import HeaderWithButtonLayout from '../../../global/components/layouts/HeaderWithButtonLayout.js.jsx';

// import resource components
import FlowLayout from '../components/FlowLayout.js.jsx';
import TaskForm from '../../task/components/TaskForm.js.jsx';

const SingleFlow = (props) => {
	const [showTaskForm, setShowTaskForm] = useState(false);
	const [task, setTask] = useState('');

	useEffect(() => {
		const { dispatch, match } = props;
		setTask(_.cloneDeep(props.defaultTask.obj));
		dispatch(flowActions.fetchSingleIfNeeded(match.params.flowId));
		dispatch(taskActions.fetchDefaultTask());
		dispatch(taskActions.fetchListIfNeeded('_flow', match.params.flowId));
	}, []);

	useEffect(() => {
		const { dispatch, match } = props;
		dispatch(taskActions.fetchListIfNeeded('_flow', match.params.flowId));
		setTask(_.cloneDeep(props.defaultTask.obj));
	}, [props.defaultTask.obj]);

	const getNewObject = () => {
		const { dispatch, match } = props;
		dispatch(taskActions.fetchListIfNeeded('_flow', match.params.flowId));
		setTask(_.cloneDeep(props.defaultTask.obj));
	};

	const _handleFormChange = (e) => {
		setTask({ ...task, [e.target.name]: e.target.value });
	};

	const _handleTaskSubmit = (e) => {
		console.log(task, 'taskshit');
		e.preventDefault();
		const { defaultTask, dispatch, match } = props;
		let newTask = { ...task };
		newTask._flow = match.params.flowId;
		dispatch(taskActions.sendCreateTask(newTask)).then((taskRes) => {
			if (taskRes.success) {
				dispatch(taskActions.invalidateList('_flow', match.params.flowId));
				setShowTaskForm(false);
				getNewObject();
				setTask(_.cloneDeep(defaultTask.obj));
			} else {
				alert('ERROR - Check logs');
			}
		});
	};

	const { defaultTask, flowStore, match, taskStore } = props;

	/**
	 * use the selected.getItem() utility to pull the actual flow object from the map
	 */
	const selectedFlow = flowStore.selected.getItem();

	// get the taskList meta info here so we can reference 'isFetching'
	const taskList =
		taskStore.lists && taskStore.lists._flow
			? taskStore.lists._flow[match.params.flowId]
			: null;

	/**
	 * use the reducer getList utility to convert the all.items array of ids
	 * to the actual task objetcs
	 */
	const taskListItems = taskStore.util.getList('_flow', match.params.flowId);

	const isFlowEmpty =
		!selectedFlow || !selectedFlow._id || flowStore.selected.didInvalidate;

	const isFlowFetching = flowStore.selected.isFetching;

	const isTaskListEmpty = !taskListItems || !taskList;

	const isTaskListFetching = !taskListItems || !taskList || taskList.isFetching;

	const isNewTaskEmpty = !task;

	const handleGoToTask = (task) => {
		// console.log(task);
		props.history.push(`/tasks/${task._id}`);
	};

	return (
		<FlowLayout>
			{isFlowEmpty ? (
				isFlowFetching ? (
					<h2>Loading...</h2>
				) : (
					<h2>Empty.</h2>
				)
			) : (
				<div
					style={{ opacity: isFlowFetching ? 0.5 : 1, paddingBottom: '50px' }}
				>
					<HeaderWithButtonLayout
						title={selectedFlow.name}
						buttonTitle={'Edit'}
						description={selectedFlow.description}
						action={() => props.history.push(`${props.match.url}/update`)}
					/>

					<hr />
					{isTaskListEmpty ? (
						isTaskListFetching ? (
							<h2>Loading...</h2>
						) : (
							<h2>Empty.</h2>
						)
					) : (
						<div style={{ opacity: isTaskListFetching ? 0.5 : 1 }}>
							{taskListItems.map((task, i) => (
								<div className="single-flow-task-item">
									<input
										onChange={() => handleGoToTask(task)}
										className="single-flow-task-item-checkbox"
										type="checkbox"
									/>
									<div className="single-flow-task-name-desc">
										<span className="single-flow-task-span-name">
											{task.name}
										</span>
										<span>{task.description}</span>
										<div className="comment-button-purple">Comment</div>
									</div>
								</div>
							))}
						</div>
					)}
					{!isNewTaskEmpty && showTaskForm ? (
						<div>
							<TaskForm
								task={task}
								cancelAction={() => (
									setShowTaskForm(false), setTask(_.cloneDeep(defaultTask.obj))
								)}
								formHelpers={{}}
								formTitle="Create Task"
								formType="create"
								handleFormChange={_handleFormChange}
								handleFormSubmit={_handleTaskSubmit}
							/>
						</div>
					) : (
						<button
							className="new-add-button"
							onClick={() => setShowTaskForm(true)}
						>
							Add Task
						</button>
					)}
				</div>
			)}
		</FlowLayout>
	);
};

SingleFlow.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
	/**
	 * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
	 * differentiated from the React component's internal state
	 */
	return {
		defaultTask: store.task.defaultItem,
		flowStore: store.flow,
		taskStore: store.task,
	};
};

export default withRouter(connect(mapStoreToProps)(SingleFlow));
