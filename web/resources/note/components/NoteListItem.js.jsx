// import primary libraries
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const NoteListItem = ({ note, action }) => {
	return (
		<div className="comment-note-holder">
			<div className="comment-image-holder" />
			<div className="comment-infor-holder">
				<div className="comment-note-info-holder">
					{' '}
					{note._user.firstName && note._user.lastName
						? `this is a comment by ${
								note._user.firstName && note._user.lastName
						  }`
						: 'Anonymous'}
				</div>
				<div className="comment-date-holder">
					{moment(note.created).format('DD/MM/YYYY')} @
					{' ' + moment(note.created).format('hh:mm a')}
				</div>

				<div className="comment-owner-holder">{note.content}</div>
			</div>
		</div>
	);
};

NoteListItem.propTypes = {
	note: PropTypes.object.isRequired,
};

export default NoteListItem;
