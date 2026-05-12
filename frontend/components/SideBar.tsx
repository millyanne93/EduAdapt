import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faRobot, faUser, faQuestionCircle, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-gray-900 text-white transition-all ${isOpen ? 'w-64' : 'w-16'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 focus:outline-none">
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="sidebar-icon" />
      </button>
      <Link href="/admin" className="sidebar-icon group">
        <FontAwesomeIcon icon={faClipboardList} className="sidebar-icon" />
        <span className={`sidebar-tooltip ${isOpen ? 'block' : 'hidden'}`}>Assessments</span>
      </Link>
      <Link href="/admin/users" className="sidebar-icon group">
        <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
        <span className={`sidebar-tooltip ${isOpen ? 'block' : 'hidden'}`}>View Users</span>
      </Link>
      {/* <Link href="/admin/view-questions" className="sidebar-icon group">
        <FontAwesomeIcon icon={faQuestionCircle} className="sidebar-icon" />
        <span className={`sidebar-tooltip ${isOpen ? 'block' : 'hidden'}`}>View Questions</span>
      </Link> */}
      <Link href="/admin/ai-question-generator" className="sidebar-icon group">
        <FontAwesomeIcon icon={faRobot} className="sidebar-icon" />
        <span className={`sidebar-tooltip ${isOpen ? 'block' : 'hidden'}`}>Generate Questions</span>
      </Link>
    </div>
  );
};

export default Sidebar;
