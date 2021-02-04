import React from 'react';

const HeaderWithButtonLayout = (props) => {
	const {
		title,
		buttonTitle,
		action,
		description,
		withBackOptions,
		backOption,
		backOptionAction,
	} = props;
	return (
		<div>
			{withBackOptions && (
				<React.Fragment>
					<div style={{ height: '15px' }} />
					<span className="back-arrow-option" onClick={backOptionAction}>
						{' '}
						{'<-'} Back to {backOption}
					</span>
				</React.Fragment>
			)}
			<div className="flow-header-style">
				<div className="task-with-checkbox">
					{withBackOptions && (
						<input
							readOnly
							checked
							type="checkbox"
							style={{
								transform: 'scale(4)',
								marginRight: '30px',
								marginLeft: '20px',
							}}
						/>
					)}
					<h1> {title} </h1>
				</div>
				{/* <Link to={'/flows/new'}> */}
				<button onClick={action} className="new-flow-button">
					{buttonTitle}
				</button>
				{/* </Link> */}
			</div>
			<div>{description ? description : ''}</div>
		</div>
	);
};

export default HeaderWithButtonLayout;
