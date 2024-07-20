import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faPlusSquare, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={` bg-gray-900 text-white transition-all ${isOpen ? 'w-64' : 'w-16'}`}>

    {/* <div className={`h-full bg-gray-900 text-white transition-all ${isOpen ? 'w-64' : 'w-16'}`}> */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 focus:outline-none">
        {isOpen ? 'Close' : 'Open'}
      </button>
      <Link href="/admin" className="sidebar-icon group">
        <FontAwesomeIcon icon={faClipboardList} className="sidebar-icon" />
        <span className="sidebar-tooltip group-hover:scale-100">Assessments</span>
      </Link>
      <Link href="/admin/user-results" className="sidebar-icon group">
        <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
        <span className="sidebar-tooltip group-hover:scale-100">User Results</span>
      </Link>
    </div>
  );
};

export default Sidebar;
